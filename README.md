# Conteos de labores · v2c

App de campo para capturar y controlar en el momento los conteos de **poda** y **aclareo**. Funciona sin conexión y sube los conteos a la base con un botón.

## Requisito en la base

Tiene que estar lanzado `LABORES_APP_01.sql`. Crea:
- la tabla `labores.app_cuentas`;
- las funciones `app_fincas`, `app_datos_finca` y `app_subir_conteo`;
- la vista `v_app_arboles_situados`.

## Publicar

1. Sube `index.html`, `sw.js` y `manifest.json` al repositorio `conteos`. En Settings → Pages, elige la rama `main` y la carpeta raíz.
2. Para cada versión nueva, cambia `CACHE_VERSION` en `sw.js`. Los móviles verán el aviso «Hay una versión nueva».
3. Sube también `plagas_sw.js` al repositorio de la app de plagas, renombrado como `sw.js`. Así esa app deja de borrar las cachés de esta: las dos comparten `alvaroapb.github.io`.

## Configurar un móvil (técnico, una vez)

1. Pestaña **⚙** → PIN `2468`.
2. **Entrar** con `campo@royal.es`.
3. **Elegir finca**. Se descargan las parcelas con su polígono vigente, la madre, la variedad, si es ciruelo, las normas de la campaña y las imágenes de satélite.

Las normas se refrescan solas cada 6 horas si hay conexión. Si alguna cambia, la app avisa.

## Contar

1. Al abrir el día, la app pregunta **quién cuenta**.
2. **Nuevo conteo**: labor y parcela. El GPS propone la parcela con «Usar».
3. **La norma sale de la base.** Se puede cambiar en campo y queda marcada como **editada**.
4. **Por árbol**:
   - fila y árbol, que se proponen solos;
   - batería, opcional;
   - rama a rama, L·C·Sc (poda) o frutos (aclareo);
   - **Siguiente** avanza y **← Atrás** vuelve a la casilla anterior.
5. **Aviso de tecleo**: si un valor supera 3 veces la media del conteo, sale un aviso en rojo. En los primeros árboles se compara con topes fijos por rama: 40 L, 40 C, 30 Sc y 150 frutos.
6. **Árbol sin ramas**: si se guarda un árbol sin nada apuntado, la app pregunta. Cuenta como 0.

## Cálculos (los del dashboard)

- **Valor del árbol**: brindillos equivalentes L + C/2 + Sc/4 (Sc/5 en ciruelo), o frutos en aclareo.
- **Desvío**: se mide desde el límite más cercano de la norma.
- **Grado**:

  | Grado | Qué es |
  |---|---|
  | 0 | en norma |
  | 1 | se sale hasta un 5 % |
  | 2 | se sale hasta un 10 % |
  | 3 | se sale más de un 10 % |

- **Colores**: ámbar si se queda corto, rojo si se pasa.
- **Indicadores del conteo**: % con margen, % en norma, y desvío medio con signo y sin signo.
- **Ramas**:
  - en rojo, los árboles con menos de 6;
  - apagados, los de 3 o menos, que tampoco cuentan en las medias por filas.

## Parcela (cómo va)

- Mapa con el desvío de cada árbol, o con su % de largos (relativo a lo que se ve).
- La tendencia general.
- Un resumen por grupos de 5 filas.

## Subida

- Pestaña **Conteos** → **Subir conteos**. Cada conteo se sube entero o no se sube; un reintento no duplica.
- Lo que se corrige después de subir entra como **versión nueva**. En la base se conserva la anterior, marcada como sustituida.
- Mientras dure la prueba, todo va con la marca `prueba = true`.
