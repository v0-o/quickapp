# Génération des icônes iOS

L'icône SVG principale est dans `icon.svg`.

Pour générer les différentes tailles PNG nécessaires pour iOS, vous pouvez utiliser :

## Option 1 : En ligne
- [CloudConvert](https://cloudconvert.com/svg-to-png) : Convertissez le SVG en PNG aux tailles suivantes :
  - 120x120 → `icon-120.png`
  - 152x152 → `icon-152.png`
  - 180x180 → `icon-180.png`
  - 192x192 → `icon-192.png`
  - 512x512 → `icon-512.png`

## Option 2 : Avec ImageMagick (si installé)
```bash
cd admin-panel/public
convert -background none icon.svg -resize 120x120 icon-120.png
convert -background none icon.svg -resize 152x152 icon-152.png
convert -background none icon.svg -resize 180x180 icon-180.png
convert -background none icon.svg -resize 192x192 icon-192.png
convert -background none icon.svg -resize 512x512 icon-512.png
```

## Option 3 : Avec Inkscape
```bash
inkscape icon.svg --export-width=120 --export-filename=icon-120.png
inkscape icon.svg --export-width=152 --export-filename=icon-152.png
inkscape icon.svg --export-width=180 --export-filename=icon-180.png
inkscape icon.svg --export-width=192 --export-filename=icon-192.png
inkscape icon.svg --export-width=512 --export-filename=icon-512.png
```

Une fois les fichiers PNG générés, l'application utilisera automatiquement ces icônes lors de l'ajout à l'écran d'accueil iOS.

