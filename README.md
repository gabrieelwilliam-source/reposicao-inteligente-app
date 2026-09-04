# Reposição Inteligente — App Vendedor 6.1 (Modo Simples)

## Experiência do vendedor
O app foi redesenhado para reduzir treinamento e resistência de uso.

Fluxo normal:
1. Digitar o código.
2. Tocar na loja.
3. Informar o estoque dos 5 produtos.
4. Conferir a sugestão.
5. Confirmar o pedido.

## O que ficou automático
- início/restauração do expediente após login;
- GPS nativo em segundo plano;
- atualização do contexto da loja;
- abertura da visita;
- registro de rota;
- persistência da visita e do estoque digitado;
- registro do pedido no rastreamento;
- sincronização com n8n/Supabase.

## O que não aparece para o vendedor
Não são exibidos precisão do GPS, distância da loja, IDs, tokens, dados técnicos,
dashboard, cálculos detalhados ou informações de infraestrutura.

## Ocorrências
Troca/devolução e validade ficam escondidas por padrão em cada produto e só são
abertas quando necessário.

## Build Android
O workflow `.github/workflows/android-debug-apk.yml` continua pronto.
Ao enviar os arquivos para o GitHub, o Actions gera o APK de debug.

## Endpoint atual
`https://app.vps7376.panel.icontainer.cloud/webhook/reposicao-vendedor`

Para outro cliente, altere `DEFAULT_API_URL` no `index.html` e os dados de marca/ícone.
