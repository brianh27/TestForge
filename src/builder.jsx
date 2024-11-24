import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insert, getState, getTests } from './backend.jsx';
import Bar from './bar.jsx';
import ask from './aiget.jsx';

async function gen({ setSite }) {
    const input = prompt("Describe the Website you Want to Build");

    // Get the generated HTML content from the ask function
    const generatedHtml = await ask({
        description: "You are a website builder bot. Your task is to generate HTML code for a modern, clean, and responsive website with inline CSS styles for all elements. Use styles like font-family, background-color, padding, border-radius, text-align, font-size, and color to style the header, navigation menu, product displays, and footer. Ensure that the layout is simple and visually appealing, with sections such as a header with a title, a navigation bar with links, a section for products, and a footer. All styles should be applied inline directly in the HTML tags. Please only return the HTML code with inline styles—do not include any extra English or explanations.",
        query: input
    });

    // Remove <head> and <body> tags if present
    const cleanedHtml = generatedHtml.replace(/<head>.*?<\/head>/s, '').replace(/<body>|<\/body>/g, '');

    // Set the cleaned HTML content for rendering
    setSite(cleanedHtml);
}



const Tools = () => {
    const navigate = useNavigate();
    const [userData, setUser] = useState(null);
    const [site, setSite] = useState(null);
  
    const params = new URLSearchParams(window.location.search);
  
    useEffect(() => {
      if (userData === null) {
        const temp = getState();
        if (temp === false) {
          navigate('/?signedIn=0');
        } else {
          setUser(temp);
        }
      }
    }, [userData, navigate]);
    console.log(site)
    return (
      <div>
        {site === null ? (
          <button onClick={() => gen({ setSite })}>Press To Generate Website</button>
        ) : (
            <div>
                <button onClick={() => gen({ setSite })}>Press To Edit Website</button>
          <div dangerouslySetInnerHTML={{ __html: site }} />
          </div>
        )}
      </div>
    );
  };
  
export default Tools;
