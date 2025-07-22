import packageList from "./packageList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();
const city = getParam("city");
packageList(".package-grid", city);