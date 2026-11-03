import express from"express";
const app = express();
app.use(express.json());
app.use(router);
export const server = app.listen(8000, () => {
console.log("server started");
});
export default app;