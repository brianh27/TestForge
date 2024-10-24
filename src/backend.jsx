import axios from "axios"
import PocketBase from 'pocketbase';    
import { useState,useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
export default async function userCheck(props){
    return axios.get("https://ai-study-guides.pockethost.io/api/collections/user_info/records").then((response)=>{
        
        const data=response.data.items
        
        

        const account=data.find(n=>n.username===props.username)
        
        if (account){
            if (account.password==props.password){
                return [true,account.id]
            }else{
                return 'Password Incorrect'
            }
        }else{
            return 'Email not found'
        }
    }).catch((err)=>{
        console.log("Error: ",err.message)
    })
}
export async function imagine({prompt}){
    try {
        console.log('ye');
        const response = await axios.get(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBqvs80rmSAz5VCUYoW-AMUV347QnFfqCE&cx=f59ad213ea49b4e52&q=${prompt}&searchType=image`)
        console.log('done');
        
        
        
        return response.data.items[0].link
    } catch (error) {
        console.error(error);
        return null
        
    }
}
export async function getTests(props){
    
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    return await pb.collection(props.col).getFullList({
        sort: '-created',
    }).then((response)=>{
        
        return response
    })
}

export async function insert(props){
    
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    return pb.collection(props.col).create(props.data).then(record=>{
        return record.id
    }).catch(error=>{
        console.log(props.data)
        return false
    })
    
    
}

export async function update(props) {
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    console.log(props)
    
    try{
        const rec=await pb.collection(props.col).getOne(props.id)
        try{
        return await pb.collection('Test').update(props.id, {
            Practice_Tests: props.cards,
            images:props.images,
            editors: rec.editors===null?[props.edi]:rec.editors.concat([props.edi])
        })
        .then(record => {
            console.log('Record updated:', record);
            return true
        })
        }
        catch(e){
            
            
            const temp=await insert({data:{Practice_Tests:props.cards,username:props.edi,editors:null},col:'Test'})
            return temp
        
        }
    }catch(e){

        
        const temp=await insert({data:{Practice_Tests:props.cards,username:props.edi,editors:null},col:'Test'})
        return temp
    }
    
    
    

    
}
export async function updateGrid(props) {
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    console.log(props)
    
    
        
        
    return await pb.collection(props.col).update(props.id, props.data)
    .then(record => {
            console.log('Record updated:', record);
            return true
    })
    
    
    
    
    

    
}
export async function updateUser({col,id,info}){
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    await pb.collection(col).update(id, info)
    .then(record => {
        console.log('Record updated:', record);
    })
}
async function checks({id}){
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    const userData=await pb.collection('users').getOne(id)
    if (userData.verified){
        return true
    }else{
        pb.authStore.clear()
        return false
    }
}
export async function login({ i, email, password, event }) {
    console.log('a');
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    try {
        i(true);
        
        await pb.collection('users').authWithPassword(email, password);
        
        const id = pb.authStore.model.id;
        //const temp = await checks({ id: id });
        
        i(false);
        return true;
    } catch (e) {
        console.log(e);
        i(false);
        return false;
    }
}
export async function verify({email}){
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    const res = await pb.collection("users").requestVerification(email)
    console.log(res)
}
export function getState (){
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    if (pb.authStore.isValid){
        console.log(pb.authStore)
        return pb.authStore.model
    }else{
        return false
    }
    
}
export function logout({nav}){
    
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    pb.authStore.clear()
    nav('/')
    
}

export async function getData(props) {
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    console.log(props)
    

    
    return pb.collection(props.col).getOne(props.id)
    .then(record => {

        console.log('Record retrieved:', record);
        return record
    }).catch(error=>{
        return false
    })
    
    
}
