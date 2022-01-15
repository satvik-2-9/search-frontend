

/* crating a custom hook here , therefore we dont need to return jsx
  & neither do we need to import react here.
*/

/* 
  
  given axios syntax.
  
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c;
  })
});

// cancel the request
cancel(); */

import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

export default function Search(query,pagenum) {
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false); 
    
    /* what happens is that whenever we type in a letter ,  */
    
    useEffect(() => {
        setBooks([]); 
    },[query])

    useEffect(() => {
         
        
        /* we want to keep cancelling our old query so that we dont query everytime we write a letter , only the word formed when the last letter is written */
        setLoading(true);
        setError(false);
        
        let cancel
        axios({
            method: 'GET',
            url: 'https://openlibrary.org/search.json',
            /* specific to the api we are using */
            params: { q: query, page: pagenum },
            cancelToken: new axios.CancelToken(c => cancel = c)
            /* this c here is a cancel function  , which can be called when ending the api call */
        }).then((res) => {
            /* functional version of setting state , allows us to manipulate the previous state.*/
            setBooks(prevBooks => {
                // basically combining our old books with our new books.
                // using the set functionality to only keep the unique book names.
                //using the spead operator to once again convert the set in to an array.
                
                return [...new Set([...prevBooks,...res.data.docs.map(b => b.title)])]; 
            
            })
            setHasMore(res.data.docs.length > 0);
            setLoading(false); 
            console.log(res.data);
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true); 
        });
        /* returning the cancel function in the useEffect hook  */
        return () => cancel();
        
    },[query,pagenum])
    return { loading, error, books, hasMore }; 
}
