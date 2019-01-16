
module.exports = function (mongoose, Types) {

    const produtoSchema = mongoose.Schema({
        id: { type: Number }, 
        nome: { type: String },
        descricao: { type: String },
        valor: { type: Number },
        valorTotal: { type: Number },
        quantidade: { type: Number },
    })

    const PedidoSchema = mongoose.Schema({
        distribuidorId: { type: Number },
        clienteId: { type: Number },
        produtos: [ produtoSchema ],
        quantidade: { type: Number },
        valorTotal: { type: Number },
        createdAt: Date,
    }, { collection: 'pedido' });    

    return mongoose.model('Pedido', PedidoSchema);
}