import { registerProduct, updateProduct, deleteProduct, getProduct, getProducts, searchProducts, nextPurchase } from "../models/productsModel.js";
import { config } from "dotenv";
import moment from "moment-timezone";

config();

// Controlador para crear un producto
export const registerProductHandler = async (req, res) => {
    try {
        const response = await registerProduct(req.body);
        res.status(201).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al registrar producto, ${error.message}` });
    }
};

// Controlador para actualizar un producto
export const updateProductHandler = async (req, res) => {
    try {
        const response = await updateProduct(req.body);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al actualizar producto, ${error.message}` });
    }
};

// Controlador para eliminar un producto
export const deleteProductHandler = async (req, res) => {
    try {
        const response = await deleteProduct(req.params.codigo);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar producto, ${error.message}` });
    }
};

// Controlador para obtener un producto
export const getProductHandler = async (req, res) => {
    try {
        const response = await getProduct(req.params.codigo);

        if (response.rows[0].ultima_compra) {
            const dateTZUltimaCompra = moment.utc(response.rows[0].ultima_compra).tz(process.env.TIME_ZONE);
            const formattedDateUltimaCompra = dateTZUltimaCompra.format(process.env.DATE_FORMAT);
            response.rows[0].ultima_compra = formattedDateUltimaCompra;
        }

        if (response.rows[0].proxima_compra) {
            const dateTZProximaCompra = moment.utc(response.rows[0].proxima_compra).tz(process.env.TIME_ZONE);
            const formattedDateProximaCompra = dateTZProximaCompra.format(process.env.DATE_FORMAT);
            response.rows[0].proxima_compra = formattedDateProximaCompra;
        }

        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener producto, ${error.message}` });
    }
};

// Controlador para obtener los productos filtrados
export const getProductsHandler = async (req, res) => {
    try {
        const response = await getProducts(req.query);

        response.rows.forEach((producto) => {
            if (producto.ultima_compra) {
                const dateTZUltimaCompra = moment.utc(producto.ultima_compra).tz(process.env.TIME_ZONE);
                const formattedDateUltimaCompra = dateTZUltimaCompra.format(process.env.DATE_FORMAT);
                producto.ultima_compra = formattedDateUltimaCompra;
            }

            if (producto.proxima_compra) {
                const dateTZProximaCompra = moment.utc(producto.proxima_compra).tz(process.env.TIME_ZONE);
                const formattedDateProximaCompra = dateTZProximaCompra.format(process.env.DATE_FORMAT);
                producto.proxima_compra = formattedDateProximaCompra;
            }
        });

        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener productos, ${error.message}` });
    }
};

// Controlador para buscar productos
export const searchProductsHandler = async (req, res) => {
    try {
        const response = await searchProducts(req.query);

        response.rows.forEach((producto) => {
            if (producto.ultima_compra) {
                const dateTZUltimaCompra = moment.utc(producto.ultima_compra).tz(process.env.TIME_ZONE);
                const formattedDateUltimaCompra = dateTZUltimaCompra.format(process.env.DATE_FORMAT);
                producto.ultima_compra = formattedDateUltimaCompra;
            }

            if (producto.proxima_compra) {
                const dateTZProximaCompra = moment.utc(producto.proxima_compra).tz(process.env.TIME_ZONE);
                const formattedDateProximaCompra = dateTZProximaCompra.format(process.env.DATE_FORMAT);
                producto.proxima_compra = formattedDateProximaCompra;
            }
        });

        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ message: `Error al buscar productos, ${error.message}` });
    }
};

// Controlador para crear la próxima compra
export const nextPurchaseHandler = async (req, res) => {
    try {
        const response = await nextPurchase(req.body);
        res.status(200).json({ message: response.notice });
    } catch (error) {
        res.status(500).json({ message: `Error al crear próxima compra, ${error.message}` });
    }
};
