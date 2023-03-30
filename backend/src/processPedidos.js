const fs = require('fs');
const path = require('path');

function lerPedidosDiretorio(diretorio) {
  const arquivos = fs.readdirSync(diretorio);

  const pedidos = arquivos.map(arquivo => {
    const id = path.parse(arquivo).name;
    const conteudo = fs.readFileSync(path.join(diretorio, arquivo), 'utf8');

    return conteudo.split('\n').map(linha => {
      if (!linha.trim()) return null;

      try {
        const pedido = JSON.parse(linha);

        if (
          typeof pedido.número_item !== 'number' ||
          typeof pedido.código_produto !== 'string' ||
          typeof pedido.quantidade_produto !== 'number' ||
          typeof pedido.valor_unitário_produto !== 'string'
        ) {
          throw new Error(`Pedido inválido no arquivo ${id}: ${linha}`);
        }

        return {
          id,
          número_item: pedido.número_item,
          código_produto: pedido.código_produto,
          quantidade_produto: pedido.quantidade_produto,
          valor_unitário_produto: parseFloat(pedido.valor_unitário_produto.replace(',', '.')),
        };
      } catch (error) {
        // Poderíamos criar uma exceção com throw, mas isso interromperia o código e não seria possível prosseguir.
        // throw new Error(`Pedido inválido no arquivo ${id}: ${linha}`);
        console.error(`Pedido inválido no arquivo ${id}: ${linha}`);
        console.error(error);
      }
    });
  }).flat().filter(Boolean);

  const numeroItens = new Set(pedidos.map(pedido => pedido.número_item));
  if (pedidos.length !== numeroItens.size || numeroItens.has(null) || !numeroItens.has(1) || !numeroItens.has(Math.max(...numeroItens))) {
    // Poderíamos criar uma exceção com throw, mas isso interromperia o código e não seria possível prosseguir.
    // throw new Error('Pedidos inválidos');
    console.error('Pedidos inválidos');
  }

  return pedidos;
}

const pedidos = lerPedidosDiretorio("./backend/src/data/Pedidos");
console.log(pedidos);
