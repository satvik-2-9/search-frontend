import { useState,useRef,useCallback,useEffect} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  
  /* we can use the custom search hook now. */

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState(false);
  const [results, setResults] = useState([]);


  useEffect(() => {
    myFunction();
    return () => {
      setResults([]); 
    };
  }, []);
  
  function myFunction() {
    setResults(
      [[{
        name: 'apple',
        _id: 'ABC10982'
      }]]
    );
  }
  
  /* var results = [
    {
     name: 'apple',
    _id: 'ABC10982'
    }
  ] */

  /* useEffect(() => {
    console.log('refreshed');
  }, [results]); 
 */
  function handleChange(e) {
    setResults([]);
   /*  results = []; */
    setLoading(true);
    axios.get(`http://localhost:5000/search`, {
        params: {
          querystring: e.target.value 
        }
      }).then((res) => {
        
       /*  for (var i = 0; i < res.data.data.length; i++){
         
          console.log(res.data.data[i].item["name"]);
           results.push({
            _id:res.data.data[i].item["_id"],
            name:res.data.data[i].item["name"]
          }); 
        } */
        console.log(res.data.data);
        setResults((prev) => {
          return [...prev, ...res.data.data]
        });
        console.log(results);
        setLoading(false);
        setErrors(false);
      }, (e) => {
        console.log(e);
        setErrors(true);
    });


  }
  return (
    <div className="App">
      <h1> Search Assignment</h1>
      <h3> - using Node.js API & MongoDB</h3>
      <input type="text" onChange={(e) =>
      { 
       
        setQuery(e.target.value);
        handleChange(e);
      }
      }></input>
      <ul>
      { results.map((result) => {
         return <li key={result._id}>{result.name}</li>
      })}
      </ul>

      {results.length===0 && query!="" && <h4>No Results Found :( </h4>}

      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error...'}</div>
    </div>
  );
}

export default App;

/* use Ref most important property is that it does not re render every time its
   value is changed  , unlike the state hook which causes a re render everytime,
   therefore storing previous values or counting the number of renders , useRef
*/