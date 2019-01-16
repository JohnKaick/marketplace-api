const express = require('express');
const mongosse = require('mongoose');

const router = express.Router()
const Carrinho = mongosse.model('Carrinho')

router.put('/cadastrar', async (req, res, next) => {

    const { id, nome, descricao, valor, quantidade, distribuidorId, clienteId } = req.body

    try {
        let produto = await Carrinho.findOne({ id, distribuidorId, clienteId })

        if (produto && produto.id) {
            await Carrinho.findOneAndUpdate({ id: produto.id, distribuidorId, clienteId }, {
                quantidade: produto.quantidade + quantidade,
                valorTotal: produto.valor * (produto.quantidade + quantidade)
            }, function (err, small) {
                if (err) return console.log('mongo_error: ' + err);    
            })
        } else {
            await Carrinho.create({
                distribuidorId,
                clienteId,
                id,
                nome,
                descricao,
                valor,
                valorTotal: valor * quantidade,
                quantidade
            }, function (err, small) {
                if (err) return console.log('mongo_error: ' + err);    
            })
        }

        res.sendStatus(200)
    } catch (err) {
        res.status(401).send({ error: 'create failed' });
    }
})

router.get('/listar/:distribuidorId/:clienteId', async (req, res, next) => {

    const { distribuidorId, clienteId } = req.params

    try {
        const Carrinhos = await Carrinho.find({ distribuidorId, clienteId })

        res.send(Carrinhos)
    } catch (err) {
        res.status(401).send({ error: 'get failed' });
    }
})

router.post('/remover', async (req, res, next) => {

    const { id, distribuidorId, clienteId } = req.body

    try {

        await Carrinho.findOneAndRemove({ id, distribuidorId, clienteId })

        res.sendStatus(200)

    } catch (err) {
        res.status(401).send({ error: 'delete failed' });
    }
})

module.exports = router