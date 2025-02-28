
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Create a Supabase client with the user's JWT
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify the user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated', details: userError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Check the user's credit balance
    const { data: creditData, error: creditError } = await supabaseClient
      .from('user_credits')
      .select('credits_balance')
      .eq('user_id', user.id)
      .single()

    if (creditError || !creditData) {
      return new Response(
        JSON.stringify({ error: 'Could not fetch user credits', details: creditError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (creditData.credits_balance < 10) { // Assuming image generation costs 10 credits
      return new Response(
        JSON.stringify({ error: 'Not enough credits', creditsNeeded: 10, currentCredits: creditData.credits_balance }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
      )
    }

    // Get the prompt from the request
    const { prompt } = await req.json()
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'No prompt provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Generating image for prompt: "${prompt}" for user: ${user.id}`)

    // Use Hugging Face API to generate the image
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    const image = await hf.textToImage({
      inputs: prompt,
      model: 'black-forest-labs/FLUX.1-schnell', // Fast and good quality model
    })

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const imageUrl = `data:image/png;base64,${base64}`

    // Log the generation in the database
    const { error: insertError } = await supabaseClient
      .from('ai_generations')
      .insert({
        user_id: user.id,
        prompt: prompt,
        type: 'image_generation',
        result_url: imageUrl,
      })

    if (insertError) {
      console.error("Error logging generation:", insertError)
    }

    // Deduct credits from the user
    const { error: updateError } = await supabaseClient.rpc('deduct_credits', { 
      p_user_id: user.id,
      p_amount: 10 // The cost for image generation
    })

    if (updateError) {
      console.error("Error updating credits:", updateError)
      // We still return the image even if credit deduction failed
    }

    // Log the credit transaction
    const { error: transactionError } = await supabaseClient
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        credits_spent: 10,
        feature_used: 'image_generation',
      })

    if (transactionError) {
      console.error("Error logging transaction:", transactionError)
    }

    return new Response(
      JSON.stringify({ image: imageUrl, remainingCredits: creditData.credits_balance - 10 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-image function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
