const express = require("express");
const ProductManager = require("../dao/ProductManager");

const productManager = new ProductManager();

const Router=require('express').Router;
const router=Router();



router.get("/", (req, res) => {
    res.json(productManager.getAll());
});

router.get("/:pid", (req, res) => {
    const product = productManager.getById(parseInt(req.params.pid));
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
});

router.post("/", async (req, res) => {
     if (
        req.body.title == null || req.body.title == undefined
    ){
        res.status(400).json({ error: "Ingrese un titulo." });
    }

    if (
        req.body.description == null || req.body.description == undefined
    ){
        res.status(400).json ({error: "Ingrese una descripcion."})
    }

    if (
        req.body.code == null || req.body.code == undefined
    ) {
        res.status(400).json ({error: "Ingrese un codigo."})
    }

    if (
        req.body.price == null || req.body.price == undefined || isNaN(req.body.price) || Number(req.body.price) <= 0
    ) {
        res.status(400).json ({error: "Ingrese un precio valido mayor a 0."})
    }

    if (
        req.body.status === null || req.body.status === undefined || req.body.status !== true && 
        req.body.status !== false)
        {
        res.status (400).json ({error: "Ingrese un estado booleano.(True o False)"})
    }

    if (
        req.body.stock == null || req.body.stock == undefined ||  typeof req.body.stock !== "number" || isNaN(req.body.stock) || req.body.stock < 0
    ){
        res.status (400).json ({error:"Ingrese un numero mayor a 0."})
    }
    if (
        req.body.category === null || 
        req.body.category === undefined || 
        typeof req.body.category !== "string" || 
        !/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(req.body.category)
    ) {
        return res.status(400).json({ error: "Ingresar solo letras y espacios." });
    }

    if (
        !Array.isArray(req.body.thumbnails) || 
        req.body.thumbnails.length === 0 || 
        !req.body.thumbnails.every(item => typeof item === "string" && item.trim() !== "")
    ) {
        return res.status(400).json({ error: "Ingrese rutas válidas." });
    }
    

    
    const product = await productManager.addProduct(req.body);
    res.json(product);
});

router.put("/:pid", async (req, res) => {
    const productid = parseInt(req.params.pid)
    if (
        req.body.id && req.body.id !== productid
    ){
        res.status(400).json ({error: "No se puede modificar ni eliminar el ID."})
    }
    
    const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
    updatedProduct ? res.json(updatedProduct) : res.status(404).json({ error: "Producto no encontrado" });
});

router.delete("/:pid", async (req, res) => {
    await productManager.deleteProduct(parseInt(req.params.pid));
    res.json({ message: "Producto eliminado" });
});

module.exports = router;
