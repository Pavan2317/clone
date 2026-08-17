const endpoints = ['/', '/api/jobs', '/api/companies', '/api/auth/login'];

async function main() {
  for (const ep of endpoints) {
    try {
      const opts = { method: 'GET' };
      if (ep === '/api/auth/login') {
        continue; // POST only
      }
      const r = await fetch('https://backend-qwbt.onrender.com' + ep);
      const j = await r.json();
      const keys = Object.keys(j);
      let summary = j.message || j.success;
      if (j.jobs) summary += ` jobs=${j.jobs.length}`;
      if (j.companies) summary += ` companies=${j.companies.length}`;
      if (j.applications) summary += ` applications=${j.applications.length}`;
      console.log(ep, '->', r.status, JSON.stringify({ keys, summary }));
    } catch (e) {
      console.log(ep, '-> ERROR', e.message);
    }
  }
  process.exit(0);
}
main();
