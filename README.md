# NgLyn

This app can be used when there is a lot of thunder and lightning in your area. You will see it on the map, and hear a thunder sound.
<https://begj.github.io/ng-lyn-app/>

## Future stuff that could be done

- Notification when lightning
- Filter how close it need to be to trigger a notification
- Mute rain button xd
- different map layers, especially for dark mode
- ah yeah, upgrade to new angular and openlayers version.

## Source of lightning

Listens to same source as lyn.met.no

`src/app/services/lyn-met.service.ts`

## Sound effects

- Rain background... yea=h, a little bit annoying :D
- Random thundersound when thunder appears.

## Openlayers with opengl for map rendering

`src/app/ligthning-map/ligthning-map.component.ts`

## NGRX/ Redux

Don't remember but I'm pretty sure I never finished NGRX for this app, since it was so small. So please ignore `src/app/ligthning-map/state` and `src/app/state`

## Deploy to github pages

run `ng deploy --base-href=/ng-lyn-app/`
