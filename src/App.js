import { useState,useRef,useCallback } from 'react';
import './App.css';
import useSearch from './Search'
function App() {
  
  /* we can use the custom search hook now. */

  const [query, setQuery] = useState(''); 
  const [pagenum, setPage] = useState(1);

  useSearch(query, pagenum);
  const { books, hasMore, loading, error } = useSearch(query,pagenum); 
  
  const obeserver = useRef();
  
  /* now ref mantains the value inside it even if the page is re rendered , ref value changing does not cause a re render. */
  
  const lastbookElementRef = useCallback(node => {
    if (loading) return;
    if (obeserver.current) obeserver.current.disconnect();
    obeserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) obeserver.current.observe(node); 
  },[loading,hasMore])


  function handleChange(e) {
    /* so everytime we change the state , the component is re rendered 
       & the useSearch hook is called.
    */
    
    setQuery(e.target.value);
    setPage(1);
  }
  


  return (
    <div className="App">
      <h1> Infinite Scroll Assignment</h1>
      <h3> - using the open library API</h3>
      <input type="text" value={query}  onChange={handleChange}></input>
      <ul>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <li key={book} ref={lastbookElementRef} >{book}</li>
        } else {
          return <li key={book} >{book}</li>
        }
      })}
      </ul>

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