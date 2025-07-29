Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  try {
    const { name, email, message } = await req.json();
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) throw new Error("API key not set");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: "Kamu <noreply@kamu.dev>",
        to: "adamristian@gmail.com",
        subject: `New contact from ${name}`,
        html: `<p><b>Email:</b> ${email}</p><p><b>Message:</b> ${message}</p>`
      })
    });
    const data = await res.json();
    return new Response(JSON.stringify({
      status: "success",
      data
    }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({
      status: "error",
      message: err.message
    }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});
