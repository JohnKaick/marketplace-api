
module.exports = function (mongoose, Types) {

    const CarrinhoSchema = mongoose.Schema({
        distribuidorId: { type: Number },
        clienteId: { type: Number },
        id: { type: Number }, 
        nome: { type: String },
        descricao: { type: String },
        valor: { type: Number },
        valorTotal: { type: Number },
        quantidade: { type: Number },
    }, { collection: 'carrinho' });    

    return mongoose.model('Carrinho', CarrinhoSchema);
}