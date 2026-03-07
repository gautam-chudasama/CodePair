import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.json({message:"Hello World!"})
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
