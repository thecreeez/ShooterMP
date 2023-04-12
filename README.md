# ShooterMP
 
## Controls:

1. WASD - Moving
2. Hold mouse left click and move mouse - Rotating
3. R - add rays (10)
4. T - reduce rays (-10)
5. F - Add max distance by (+0.1)
6. G - Remove max distance by (+0.1)

## Global variables to change some stuff

### Game events:
1. GAME_EVENT_Y_IS_RAYS [ BOOLEAN ] - Rays is 5000 / y
2. GAME_EVENT_Y_IS_HEIGHT [ BOOLEAN ] - Height is y
3. GAME_EVENT_DANCING_ROOM [ BOOLEAN ] - Some pixels on walls just take random colors
4. GAME_EVENT_INVERTED_COLORS [ BOOLEAN ] - All colors inverted
5. GAME_EVENT_WONT_DELETE_FRAMES [ BOOLEAN ] - Previous frame wont deleted (also sky and floor not rendering)
6. GAME_EVENT_MAX_DRAWS [ INT ] - Max draws per frame (-1 is disabled)

### Render options
1. RENDER_TYPE [ RENDER_TYPES ] - Type of render (Can be OPTIMIZED for stable FPS and TEXTURIZED for cool graphics)
2. SHOULD_RENDER_SKYBOX [ BOOLEAN ] - Should render floor and sky
3. SKY_COLOR [ ARRAY_INT(3) ] - RGB color of sky
4. FLOOR_COLOR [ ARRAY_INT(3) ] - RGB color of floor