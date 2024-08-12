'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { query, collection, getDocs, getDoc, where, setDoc, doc, deleteDoc, querySnapshot } from "firebase/firestore";
import { Box, Button, IconButton, Modal, Stack, TextField, List, ListItem, Typography, ListItemText, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { firestore } from "@/firebase";


export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [filterField, setFilterField] = useState('');
  const [filterCondition, setFilterCondition] = useState('==');
  const [filterValue, setFilterValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  

  const upadatePantry = async () =>{
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({
        name: doc.id,
        ...doc.data(),
      })
    });
    setPantry(pantryList)
  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore,'pantry'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }else{
      await setDoc(docRef,{quantity: 1})
    }
    await upadatePantry()
  }

  const removedItem = async (item) =>{
    const docRef = doc(collection(firestore,'pantry'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity === 1){
        await deleteDoc(docRef)
      }else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await upadatePantry()
  }
const searchItems = async (field, value) =>{
  try {
    const q = query(collection(firestore, 'pantry'), where(field, '==', value));
    const querySnapshot = await getDocs(q);

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return results;
  } catch (error) {
    console.error('Error searching items: ', error);
    return [];
  }
};

const filterItems = async(filed, condition, value)=> {
  try{
    const q = query(collection(firestore, "pantry"), where(filterField, condition, value));
    const querySnapshot = await getDocs(q);

    const results = [];
    querySnapshot.forEach((doc)=> {
      results.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return results;
  }catch(error){
    console.error("Error filtering items: ", error);
    return [];
  }
}

const handleSearch = async () => {
  if (searchQuery) {
    console.log('Searching for:', searchQuery);
    const results = await filterItems("name", '==', searchQuery);
    console.log('Search results:', results);
    setSearchResults(results);
  }
};

const handleFilter = async () => {
  if (filterField && filterCondition && filterValue) {
    console.log('Filtering for:', filterField, filterCondition, filterValue);
    const results = await filterItems(filterField, filterCondition, filterValue);
    console.log('Filter results:', results);
    setSearchResults(results);
  }else{
    setSearchResults([]);
  }
};

  useEffect(()=>{
    upadatePantry()
  }, [])

  const handleOpen =()=> setOpen(true)
  const handleClose =()=> setOpen(false)
  
  return (
    <Box width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      gap={2}
      p={2}
      >
      
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" 
        top="50%" 
        left="50%"
        width={{ xs: '90%', sm: 400 }} 
        bgcolor="white"
        border="2em solid #000" 
        boxShadow={24} 
        p={4}
        display="flex"
        flexDirection={"column"}
        gap={3}
        sx={{
          transform:'transform(-50%, -50%)'
        }}>  
        <Typography variant="h6">
          Add Item
          </Typography>
        <Stack width="100%" direction="row" spacing={2}>
          <TextField
        variant="outlined"
        fullWidth value={itemName}
        onChange={(e)=>{
          setItemName(e.target.value)
        }}
        ></TextField>
        <Button variant="outlined"
        onClick={()=>{
          addItem(itemName)
          setItemName('')
          handleClose()
        }}
        >Add</Button>
        </Stack>
        </Box>
      </Modal>
      <Button
      variant="contained"
      onClick={handleOpen}>
        Add New Item
      </Button>
      
      <Box border="1px solid #333" display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth="1200px">
      <Box width="100%" height="30%" color="#ADD8E6" display="flex" alignItems="center" justifyContent="center" p={0.1}> 
        <Typography variant="h2" color="#333" textAlign="center">Pantry Tracker</Typography>
      </Box>
      <Box width="30%" p={1}>
        <Box display="flex" flexDirection={{xs: 'column', md: 'row'}} alignItems="center" mb={1}>
          <TextField
            label="Search Items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} fullWidth sx={{md: {xs: 2, md:0},mr: {md: 2} }}
          />
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" mb={1}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="filter-field-label">Filter Field</InputLabel>
            <Select
              labelId="filter-field-label"
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              label="Filter Field"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={'quantity'}>Count</MenuItem>
              {/* Add more filter fields as needed */}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="filter-condition-label">Condition</InputLabel>
            <Select
              labelId="filter-condition-label"
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              label="Condition"
            >
              <MenuItem value={'=='}>
                <em>Equals</em>
              </MenuItem>
              <MenuItem value={'>'}>Greater Than</MenuItem>
              <MenuItem value={'<'}>Less Than</MenuItem>
              {/* Add more conditions as needed */}
            </Select>
          </FormControl>
          <TextField
            label="Filter Value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <IconButton onClick={handleFilter}>
            <SearchIcon />
          </IconButton>
        </Box>
          <List>
          {searchResults.length > 0 && (
            <>
              <Typography variant="h2">Search Results:</Typography>
              {searchResults.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText primary={item.name} secondary={`Count: ${item.quantity}`} />
                </ListItem>
              ))}
            </>
          )}
        </List>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {
          pantry.map(({name, quantity})=>
          <Box 
          key={name}
          width="100%"
          midheight="150px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding={2}
          flexDirection={{ xs: 'column', md: 'row' }}
              textAlign="center">
            <Typography  
            variant="h3" 
            color="#333" 
            mb={1}>{name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography  
            variant="h3" 
            color="#333" 
            mb={1}>{quantity}
            </Typography>
            <Stack direction ="row" spacing={1} >
              <Button variant="contained" onClick={()=>{
                addItem(name)
              }}>Add</Button>
              <Button variant="contained" onClick={()=>{
                removedItem(name)
              }}>Remove</Button>
              </Stack>
          </Box>)
        }
      </Stack>
      </Box>
    </Box>
  );
}


  