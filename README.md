# JSHP-App
A [JSHP](https://github.com/OogleGlu/JSHP) app made for speed comparison against PHP.

### Opponent
Visit [PHP-App](https://github.com/OogleGlu/PHP-App) to explore.

### Files of concern
- [index.php](https://github.com/OogleGlu/PHP-App/blob/main/Public/index.php)
- [index.jshp.html](https://github.com/OogleGlu/JSHP-App/blob/main/Public/index.jshp.html)
- [gclcm.html](https://github.com/OogleGlu/JSHP-App/blob/main/Public/gclcm.html)


### Results
```
- Device:  Android with Termux
- Host:    localhost
- Browser: Chrome Android incognito
- 2nd and 3rd records are reloads

PHP:  /gclcm.html
JSHP: /gclcm.html

STATIC     PHP (ms)    JSHP (node-static) (ms)
  1          200               205
  2          153               132
  3          146               152

PHP:  /index.php
JSHP: /index.jshp.html

DYNAMIC    PHP (ms)    JSHP (ms)
  1          246         1160
  2          200         1060
  3          188         1010
```

### Conclusion
PHP just destroys JSHP in serving dynamic files.
