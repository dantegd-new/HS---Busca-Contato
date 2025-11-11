import React from 'react';

export const IntegrationDocs: React.FC = () => {
    const codeSnippet = `
fetch('https://api.buscacontatos.com/v1/contatos', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk_live_YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
`;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Documentação da API</h3>
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                    Use sua chave de API para acessar seus contatos programaticamente. A autenticação é feita através do header <code>Authorization</code> com o valor <code>Bearer SEU_TOKEN</code>.
                </p>
                <h4>Endpoint: Listar Contatos</h4>
                <p>
                    <code>GET /v1/contatos</code>
                </p>
                <p>
                    Retorna uma lista de todos os contatos salvos.
                </p>

                <h4>Exemplo de Requisição</h4>
                <pre className="bg-slate-800 text-white p-4 rounded-md overflow-x-auto">
                    <code>
                        {codeSnippet.trim()}
                    </code>
                </pre>

                 <h4>Webhook: <code>contato.created</code></h4>
                 <p>
                    Quando um novo contato é salvo, enviaremos uma requisição <code>POST</code> para a URL do seu webhook configurado com os detalhes do contato no corpo da requisição em formato JSON.
                 </p>
            </div>
        </div>
    );
};
