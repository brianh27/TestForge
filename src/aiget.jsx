import { useState } from 'react'
import OpenAI from "openai";

const part1='sk-proj-JiSZqD3tJTaUuSva4C6jySQfEWKjaPkxJsdRfhme6HkoajoLu9U8H4010hx'
const part2="SbjTuC3h4bzbwHbT3BlbkFJoZxp2hlBF8zTf0-VqE-p9Ab8IuCoBLLeTIA5tQWS4tc7Qn9D4fUybda2wXO7W5i5IUe02z5EYA"
const openai = new OpenAI({apiKey:part1+part2,dangerouslyAllowBrowser: true});

async function ask(props) {
    
    
    
    // if (props.description==="You are a website builder bot. Your task is to generate HTML code for a modern, clean, and responsive website with inline CSS styles for all elements. Use styles like font-family, background-color, padding, border-radius, text-align, font-size, and color to style the header, navigation menu, product displays, and footer. Ensure that the layout is simple and visually appealing, with sections such as a header with a title, a navigation bar with links, a section for products, and a footer. All styles should be applied inline directly in the HTML tags. Please only return the HTML code with inline styles—do not include any extra English or explanations. DO NOT INCLUDE AN HTML HEADER. Also don't include any style header like style=font-family: Arial, sans-serif; margin: 0; padding: 0;. The styles I provided to you will be default you shall always use. Also exclude the ```html text at the begining and the end"){
    //     return '<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;"> <header style="background-color: #28a745; color: white; padding: 20px 0; text-align: center;"> <h1>Modern Product Showcase</h1> </header> <nav style="display: flex; justify-content: center; background-color: #34d058; padding: 10px;"> <a href="#home" style="color: white; margin: 0 15px; text-decoration: none; font-size: 18px;">Home</a> <a href="#products" style="color: white; margin: 0 15px; text-decoration: none; font-size: 18px;">Products</a> <a href="#about" style="color: white; margin: 0 15px; text-decoration: none; font-size: 18px;">About</a> <a href="#contact" style="color: white; margin: 0 15px; text-decoration: none; font-size: 18px;">Contact</a> </nav> <section id="products" style="display: flex; justify-content: center; margin: 30px 0;"> <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); padding: 20px; margin: 0 15px; text-align: center; width: 250px; transition: transform 0.3s;"> <img src="https://via.placeholder.com/250" alt="Product 1" style="width: 100%; border-radius: 8px;"> <h3>Product 1</h3> <p>Description of Product 1.</p> <p>$10.00</p> </div> <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); padding: 20px; margin: 0 15px; text-align: center; width: 250px; transition: transform 0.3s;"> <img src="https://via.placeholder.com/250" alt="Product 2" style="width: 100%; border-radius: 8px;"> <h3>Product 2</h3> <p>Description of Product 2.</p> <p>$15.00</p> </div> <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); padding: 20px; margin: 0 15px; text-align: center; width: 250px; transition: transform 0.3s;"> <img src="https://via.placeholder.com/250" alt="Product 3" style="width: 100%; border-radius: 8px;"> <h3>Product 3</h3> <p>Description of Product 3.</p> <p>$20.00</p> </div> </section> <footer style="background-color: #28a745; color: white; padding: 20px; text-align: center; position: relative; bottom: 0; width: 100%;"> <p>&copy; 2023 Modern Product Showcase</p> </footer> </body>'
    // }else if (props.description==='Using comments to label and seperate this HTML code so that it turns into different sections of the website. ONLY RETURN THE HTML CODE WITH COMMENTS. NO EXTRA ENGLISH'){
    //     
    // }
    return await openai.chat.completions.create({

        messages: [{"role": "system", "content": props.description},{'role':'user','content':props.query}],
      model: "gpt-4o-mini",
    }).then(completion=>{
        const message=completion.choices[0].message.content
        return message
    })

    
}

  

export default ask
