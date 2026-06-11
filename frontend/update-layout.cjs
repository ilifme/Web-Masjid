const fs = require("fs");

let layout = fs.readFileSync("src/components/admin/AdminLayout.jsx", "utf-8");

// 1. Add FiLock import
layout = layout.replace("import {", "import {\n  FiLock,");

// 2. Add change password link in header before Lihat Website
layout = layout.replace(
  '<Link\n                to="/"\n                target="_blank"\n                className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"\n              >\n                Lihat Website\n              </Link>',
  '<Link\n                to="/admin/change-password"\n                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5"\n              >\n                <FiLock className="w-4 h-4" /> Ganti Password\n              </Link>\n              <Link\n                to="/"\n                target="_blank"\n                className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"\n              >\n                Lihat Website\n              </Link>'
);

fs.writeFileSync("src/components/admin/AdminLayout.jsx", layout, "utf-8");
console.log("AdminLayout updated successfully");
