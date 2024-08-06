'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { query, collection, getDocs, getDoc, setDoc, doc, deleteDoc } from "firebase/firestore";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { firestore } from "@/firebase";


export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  

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

  const AddItem = async (item) =>{
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

  useEffect(()=>{
    upadatePantry()
  }, [])

  const handleOpen =()=> setOpen(true)
  const handleClose =()=> setOpen(false)

  return (<Box width="100vw" 
  height="100vw" 
  display="flex" 
  flexDirection="column"
  justifyContent="center" 
  alignItems="center" 
  gap={2}>
    <Modal open={open} onClose={handleClose}>
      <Box position="absolute" 
      top="50%" 
      left="50%"
      width={400} 
      bgcolor="white"
      border="2px solid #000" 
      boxShadow={24} 
      p={4}
      display="flex"
      flexDirection={"column"}
      gap={3}
      sx={{
        transform:'transform(-50%, -50%)'
      }}>  
      <Typography variant="h6">Add Item</Typography>
      <stack width="100" direction="row" spacing={2}><TextField
      variant="outlined"
      fullWidth value={itemName}
      onChange={(e)=>{
        setItemName(e.target.value)
      }}
      ></TextField>
      <Button variant="outlined"
      onClick={()=>{
        AddItem(itemName)
        setItemName('')
        handleClose()
      }}
      >Add</Button>
      </stack>
      </Box>
    </Modal>
    <Button
    variant="contained"
    onClick={()=>{
      handleOpen()
    }}>
      Add New Item
    </Button>
    <Box border="1px solid #333">
    <Box width="800px" height="100px" color="#ADD8E6" alignItems="center" justifyContent="center" display="flex"> 
      <Typography variant="h2" color="#333">Pantry Tracker</Typography>
    </Box>
    
    <stack width="800px" height="300px" spacing={2} overflow="auto">
      {
        pantry.map(({name, quantity})=>
        <Box 
        key={name}
        width="100%"
        midHeight="150px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="#f0f0f0"
        padding={5}>
          <Typography  variant="h3" color="#333" textAlign="center">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
          <Typography  variant="h3" color="#333" textAlign="center">{quantity}</Typography>
          <stack direction ="row" >
          <Button variant="contained" onClick={()=>{
              AddItem(name)
            }}>Add</Button>
            <Button variant="contained" onClick={()=>{
              removedItem(name)
            }}>Remove</Button>
            </stack>
        </Box>)
      }
    </stack>
    </Box>
    </Box>)
}
