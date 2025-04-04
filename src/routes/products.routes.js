const express = require("express");
const mongoose = require("mongoose");
//const ProductManager = require("../dao/ProductManager");
const ProductManagerMongoo = require("../dao/ProductManagerMongoo.js");

const productManager = new ProductManagerMongoo();


const Router=require('express').Router;
const router=Router();
router.get('/', async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const hasParams = limit !== "10" || page !== "1" || sort || query;
  
      if (!hasParams) {
        const productos = await productManager.get();
        return res.status(200).json({ status: 'success', payload: productos });
      }
  
      const data = await productManager.getPaginatedProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query: query ? { category: query } : {}
      });
  
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      
      const prevLink = data.hasPrevPage ? `${baseUrl}?page=${data.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
      const nextLink = data.hasNextPage ? `${baseUrl}?page=${data.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
  
      res.status(200).json({
        status: 'success',
        payload: data.products,
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink,
        nextLink
      });
  
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
  });
  
  

router.get("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;

        // Validar que el ID es un ObjectId de MongoDB
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: "ID no válido" });
        }

        // Buscar el producto
        const product = await productManager.getById({_id:pid});

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        return res.json(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
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

       
        if (typeof thumbnails === "string" && thumbnails.trim() === "") {
            req.body.thumbnails = [];
        }

       
        if (
            !Array.isArray(req.body.thumbnails) || 
            req.body.thumbnails.some(item => typeof item !== "string" || item.trim() === "")
        ) {
            return res.status(400).json({ error: "Ingrese rutas válidas." });
        }

        //  Si no se envían imágenes, asignar una por defecto
        if (req.body.thumbnails.length === 0) {
            req.body.thumbnails = ["https://via.placeholder.com/150"];
        }

    

    
        const product = await productManager.addProduct(req.body);
    res.json(product);
});

/*router.put("/:pid", async (req, res) => {
    const productid = parseInt(req.params.pid)
    if (
        req.body.id && req.body.id !== productid
    ){
        res.status(400).json ({error: "No se puede modificar ni eliminar el ID."})
    }
    
    const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
    updatedProduct ? res.json(updatedProduct) : res.status(404).json({ error: "Producto no encontrado" });
});*/

router.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: "ID no válido" });
        }

        const updatedProduct = await productManager.update(pid, req.body);

        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error al actualizar producto" });
    }
});


router.delete("/:pid", async (req, res) => {
    await productManager.delete(req.params.pid);
    res.json({ message: "Producto eliminado" });
});

module.exports = router;
