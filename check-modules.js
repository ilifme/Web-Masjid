const http = require("http");

function getUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

async function check() {
  try {
    let html = await getUrl("http://localhost:5173/");
    console.log("HTML loaded: " + html.length + " bytes");
    
    let main = await getUrl("http://localhost:5173/src/main.jsx");
    console.log("main.jsx loaded: " + main.length + " bytes");
    
    let app = await getUrl("http://localhost:5173/src/App.jsx");
    console.log("App.jsx loaded: " + app.length + " bytes");
    
    let home = await getUrl("http://localhost:5173/src/pages/public/HomePage.jsx");
    console.log("HomePage.jsx loaded: " + home.length + " bytes");
    
    let admin = await getUrl("http://localhost:5173/src/pages/admin/AdminLogin.jsx");
    console.log("AdminLogin.jsx loaded: " + admin.length + " bytes");
    
    console.log("\n✅ All modules loadable!");
  } catch(e) {
    console.log("❌ Error: " + e.message);
  }
}
check();
