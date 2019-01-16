const express = require('express');
const mongosse = require('mongoose');

const router = express.Router()
const Carrinho = mongosse.model('Carrinho')
const Pedido = mongosse.model('Pedido')

router.put('/cadastrar', async (req, res, next) => {

    const { distribuidorId, clienteId } = req.body

    try {
        let qtsTotal = 0
        let vlTotal = 0

        let carrinho = await Carrinho.find({ distribuidorId, clienteId }).select({ '_id': 0, 'distribuidorId': 0, 'clienteId': 0 })

        for (let c of carrinho) {
            qtsTotal += c.quantidade
            vlTotal += c.valorTotal
        }

        let pedido = await Pedido.create({
            distribuidorId, 
            clienteId,
            produtos: carrinho,
            quantidade: qtsTotal,
            valorTotal: vlTotal,
            createdAt: new Date()
        }, async function (err, small) {
            if (err) return console.log('mongo_error: ' + err);
            await Carrinho.remove({ distribuidorId, clienteId })
        })

        res.sendStatus(200)
    } catch (err) {
        res.status(401).send({ error: 'create failed' });
    }
})

router.get('/listar/:distribuidorId', async (req, res, next) => {

    const { distribuidorId } = req.params

    try {
        const pedidos = await Pedido.find({ distribuidorId })
        
        res.send(pedidos)
    } catch (err) {
        res.status(401).send({ error: 'get failed' });
    }
})

router.get('/listar/detalhe/:id', async (req, res, next) => {

    const { id } = req.params

    try {
        const pedido = await Pedido.findOne({ _id: id })

        res.send(pedido)
    } catch (err) {
        res.status(401).send({ error: 'get failed' });
    }
})

router.delete('/remover/:id', async (req, res, next) => {

    const { id } = req.params

    try {

        await Pedido.findOneAndRemove({ _id: id })

        res.sendStatus(200)

    } catch (err) {
        res.status(401).send({ error: 'delete failed' });
    }
})

module.exports = router