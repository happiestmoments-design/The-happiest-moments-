export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount } = req.body;

    const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ZIINA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        currency_code: 'AED',
        test: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'فشل إنشاء طلب الدفع');
    }

    res.status(200).json({ embedded_url: data.embedded_url });
  } catch (error) {
    console.error('❌ خطأ:', error);
    res.status(500).json({ error: error.message });
  }
}
