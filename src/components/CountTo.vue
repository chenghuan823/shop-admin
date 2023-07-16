<script setup>
import {reactive,watch} from 'vue'
import gsap from 'gsap'

const props=defineProps({
    value:{
        default:0
    }
})

const d=reactive({
    num:0
})

const AnimateToValue=()=>{
    gsap.to(d,{
        duration:.5,
        num:props.value
    })
}
AnimateToValue()

watch(()=>props.value,()=>{
    AnimateToValue()
})

</script>

<template>
        {{ d.num }}
</template>