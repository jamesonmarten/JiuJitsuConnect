import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Explore() {
  console.log("Explore component rendering at:", new Date().toLocaleTimeString());

  return (
    <div style={{ 
      backgroundColor: 'green', 
      color: 'white',
      padding: '2rem',
      fontSize: '24px',
      fontWeight: 'bold',
      minHeight: '100vh'
    }}>
      <div style={{ backgroundColor: 'yellow', color: 'black', padding: '20px', margin: '20px' }}>
        EXPLORE PAGE IS RENDERING - {new Date().toLocaleTimeString()}
      </div>
      <div>This is the Explore page content</div>
    </div>
  );
}