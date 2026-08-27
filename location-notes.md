# Localização confirmada

O link oficial do Google Maps aponta para **Dentista Tatuapé — Dra. Monique Cascapera**.

Endereço: R. Emílio Mallet, 317 — sala 307 — Vila Gomes Cardim, São Paulo — SP, 03320-000, Brasil.

Coordenadas confirmadas: latitude -23.547313, longitude -46.570779.

O script do Google Maps via proxy do preview retornou falha de carregamento e o bloco ficou vazio. O endpoint público de embed redirecionou para uma página que informa que a Google Maps Embed API deve ser usada em um iframe; portanto, a implementação precisa manter fallback visual clicável ou corrigir o proxy/SDK sem inventar o mapa.

Validação do preview: o iframe oficial foi inserido, mas o screenshot desktop e o mobile ainda exibiram apenas o cartão escuro sem o mapa visível. O endereço e os botões continuam no layout, porém é necessário substituir a visualização por uma solução visual que carregue de forma confiável no site publicado.

O URL direto do lugar retorna `x-frame-options: SAMEORIGIN`, portanto não pode ser incorporado no domínio do site. O mapa permanece visualmente vazio no preview quando usado como iframe. A implementação deve usar uma visualização oficial compatível com incorporação, ou um mapa visual próprio com botão de abertura no Google Maps, sem fingir que um bloco decorativo é o mapa.

Validação final: o mapa estático real do Google Maps aparece no cartão do rodapé em desktop e mobile, com recorte sem painel lateral. O endereço confirmado permanece ao lado e os botões de rota Google Maps e Uber ficam acessíveis em ambos os tamanhos.

Correção oficial concluída: a procedure pública `maps.staticMap` retorna 200 e uma imagem PNG do Google Static Maps via backend, sem expor a chave. O mapa oficial aparece visualmente no rodapé em desktop e mobile; o screenshot manual deixou de ser usado pelo frontend. Os botões Google Maps e Uber continuam apontando para o endereço e coordenadas confirmados.

Validação da correção da barra lateral: screenshots full-page em 390px e 1280px mostram a página sem a barrinha visual nas bordas, mantendo a composição, o mapa e o botão da Clara. A rolagem continua disponível; apenas a barra gráfica do navegador foi ocultada.
