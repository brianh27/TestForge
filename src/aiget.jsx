import { useState } from 'react'
import OpenAI from "openai";

const part1='sk-proj-JiSZqD3tJTaUuSva4C6jySQfEWKjaPkxJsdRfhme6HkoajoLu9U8H4010hx
const part2='SbjTuC3h4bzbwHbT3BlbkFJoZxp2hlBF8zTf0-VqE-p9Ab8IuCoBLLeTIA5tQWS4tc7Qn9D4fUybda2wXO7W5i5IUe02z5EYA'

const openai = new OpenAI({apiKey:part1+part2,dangerouslyAllowBrowser: true});


async function ask(props) {
    
    
    
    return await openai.chat.completions.create({

        messages: [{"role": "system", "content": props.description},{'role':'user','content':props.query}],
      model: "gpt-4o-mini",
    }).then(completion=>{
        const message=completion.choices[0].message.content
        return message
    })

    
}

  

export default ask
