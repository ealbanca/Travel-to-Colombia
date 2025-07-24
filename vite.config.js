import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        package: resolve(__dirname, "src/package_pages/index.html"),
        packageList: resolve(__dirname, "src/package_list/index.html"),
        contact: resolve(__dirname, "src/contact/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        thankyou: resolve(__dirname, "src/thankyou/thankyou.html"),
        orders: resolve(__dirname, "src/orders/orders.html"),
      },
    },
  },
});
