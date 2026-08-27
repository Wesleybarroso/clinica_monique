# Auditoria de overflow horizontal

Medição feita no preview com Chrome headless após a correção da barra visual.

| Viewport | scrollWidth | clientWidth | Diferença |
|---|---:|---:|---:|
| 390px | 390px | 390px | 0px |
| 1280px | 1280px | 1280px | 0px |

Os elementos que ultrapassam visualmente os limites — órbitas decorativas, selo do hero, cartão flutuante e imagem do espaço — permanecem dentro de contêineres com `overflow: hidden` ou `overflow: clip`, sem aumentar a largura rolável do documento. A barrinha capturada era a barra nativa de rolagem vertical, não overflow horizontal. A correção mantém a rolagem, mas oculta apenas a barra visual com `scrollbar-width: none` e `::-webkit-scrollbar`.
