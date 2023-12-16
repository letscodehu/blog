---
id: 6430
title: 'Terminálor 3 &#8211; a tmux sessionök lázadása'
date: '2022-03-24T14:42:30+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=6430'
permalink: /2022/03/24/terminalor-3-a-tmux-sessionok-lazadasa/
newsphere-meta-content-alignment:
    - align-content-left
amazonS3_cache:
    - 'a:1:{s:77:"//letscode.huassets/uploads/2022/03/Screenshot-2022-03-24-at-9.32.35.png";a:1:{s:9:"timestamp";i:1702651452;}}'
image: 'assets/uploads/2022/03/Screenshot-2022-03-24-at-14.39.35.png'
categories:
    - Egyéb
    - 'Kocka élet'
tags:
    - devex
    - script
    - session
    - tmux
---

A korábbi vim-es cikkem sikertelenségén felbuzdulva most egy újabb terminálhoz kapcsolódó cikkel érkezem, amivel remélhetőleg sikerül áttériteni pár olvasót a fekete alapon fehér oldalra.

**Figyelem! Az alábbi cikk terminál ablakokat, CLI parancsokat és egyéb, GUI-hoz szokott fejlesztőket felkavaró elemeket tartalmazhat. Megtekintését csak erős idegzetűeknek ajánljuk.**

Ezúttal a tmux lesz kereszttűzben, na de nem amolyan tutorial jelleggel, persze nem úszom meg, hogy egy pár szót emlitsek az alapokról.

### Mi is a tmux?

Ez egy úgynevezett terminal multiplexer, ami arra jó, hogy egy terminál ablakban több terminált tudjunk kezelni. Ez még önmagában nem hangzik nagy valaminek, hiszen miért ne nyithatnánk egy csomó terminált, van RAM meg CPU bőven, nem? A gond az, hogy a sok terminál között simán elveszünk, hogy éppen melyikben vagyunk, nehezebb csoportosítani azokat, főleg projektenként és azok közti váltás is macerásabb. A cikkben összesen 7 terminált fogunk futtatni egyben, két projektre bontva.

Amit leggyakrabban fel szoktak hozni még érvként, az az, hogy a tmux, paranccsori alkalmazás révén szervergépeken is futhat, igy ha pl. vannak gyakran futtatott parancsok, tailelt logok és hasonlók, akkor azok futhatnak egy szerveren egy munkamenetben és bármikor belépünk SSH-val, csak egy parancs és máris látjuk őket, nem kell több SSH kapcsolatot indítani, nem fog elveszni az állapotuk, ha kilépünk és utána vissza, ugyanúgy várnak majd, mint ahogy leállítottuk.

### Telepítés

Na de akkor telepitsük fel és nézzünk bele!

Linuxon (debian-like):

```
sudo apt install tmux
```

Mac-en (feltételezve, hogy a homebrew fel van telepitve):

```
brew install tmux
```

Windowson pedig a WSL-t használva az adott linux distro csomagkezelőjével tudjuk feltelepiteni.

### Ismerkedés a parancsokkal

Most, hogy feltelepitettük, akkor inditsuk is el:

```
tmux
```

... és látszólag nem történt semmi. Azonban mi már a "tmuxban" vagyunk. A tmux-on belül van egy úgynevezett prefix key, egy billentyűkombináció, amivel különböző akciókat tudunk végrehajtani belül. Ez a kombináció alapból a `Ctrl+B`. Ez természetesen testreszabható lesz, a cikk hátralevő részében pedig csak `<prefix key>`-ként fogunk rá hivatkozni.

```
ls -la
```

Ez kilistázza az aktuális mappa tartalmát, ezt mindenki tudja, akkor mégis minek kellett kiadni ezt a parancsot? Mindjárt kiderül!  
Ezután adjuk ki a `Ctrl + B + c` kombinációt. A mappa kilistázása eltűnt, illetve nem is eltűnt, hanem egy új ablakot hoztunk létre a tmuxon belül, ami jelenleg üres és csak egy shell fut benne. Ha a képernyő aljára nézünk, akkor látjuk, hogy egy 0 és egy 1-es számú úgynevezett ablakunk van. Ezek között a `<prefix key>+ n` (mint next, azaz következő) és `<prefix key>+ p` (mint previous, azaz előző) segitségével tudunk lépkedni.

Ha a parancsok listáját akarjuk megnézni, akkor azt a `<prefix key> + ?`-el tudjuk elérni.  
Tehát az egyik ilyen fogalom a window, a másik az ablakon belüli osztás az úgynevezett pane.

Nézzük meg, hogy tudunk ilyen osztást létrehozni!

A `<prefix key> + "` függőlegesen, a `<prefix key> + %` pedig vizszintesen osztja fel az aktuális ablakot. Ha pedig egy ilyen osztást be akarunk zárni, akkor `<prefix key> + x` lesz a parancs.

### A munkamenetek

A harmadik és igen fontos fogalom az úgynevezett session, azaz munkamenet. Ezzel fogunk majd trükközni. Eddig még nem beszéltünk róla, de a tmux igazából egy kliens-szerver architektúra mentén működik. Tehát van egy tmux szerver, ami fut a gépünkön és amikor a tmux parancsot kiadjuk, akkor igazából csak egy klienst nyitunk afelé. A szerveren egy ilyen kliens egy munkamenethez csatlakozik vagy ha még nincs, akkor létrehoz egyet. Nézzük is meg hogy néz ki ez!

Ehhez először is a tmux kliensből ki kell lépjünk. Az `exit` paranccsal zárjuk be a két shellt, ami fut a két ablakban. Ezután:

```
tmux new-session -d -s "new session"
```

Ez a parancs létrehoz egy új munkamenetet 'new session' néven (a `-s` kapcsoló a session name) és utána rögtön ki is lép belőle (a `-d` az úgynevezett detach, leválasztás), de a háttérben a munkamenet ugyanúgy fut tovább.

Ha vissza akarunk rá csatlakozni, akkor az attach-session lesz a mi parancsunk.

```
tmux attach-session "new session"
```

Ezzel már újra a tmux kliensben vagyunk a "new session" munkamenetben. Ha a futó kliensünket le akarjuk választani egy ilyen munkamenetről, akkor a `<prefix key> + d` -vel tudjuk elérni.

Ezután listázzuk ki a munkameneteket:

```
tmux list-sessions
```

Ez pedig kilistázza a futó munkameneteket, azok nevét, mikor lettek létrehozva és csatlakozik-e hozzá kliens.

```
0: 5 windows (created Fri Mar  4 13:16:45 2022)
new session: 1 windows (created Wed Mar 23 15:09:32 2022) (attached)
```

Tehát tudunk olyat csinálni, hogy van két projektünk, amik közt gyakran váltogatunk, az egyikhez kell webpack, kell egy node, egy editor, esetünkben neovim, na meg logokat is néznénk valahol. Ez lesz egy munkamenetben, aztán van egy másik projekt, amin szintén van webpack, neovim és cordova. Mivel lusta fejlesztők vagyunk, ezért nem akarjuk minden alkalommal elindítgatni a dolgokat, hanem azt akarjuk, hogy egy parancsra az egész működjön, ugye? Akkor oldjuk is meg!

### A lényeg - startup script

A fenti parancsokkal már láttuk, hogy tudunk létrehozni új sessiont tmuxon kívülről, a parancssorból, ennél sokkal többet tudunk csinálni és ezeket fogjuk összefűzni egy kis shell scriptbe. Legyen a neve az elsőnek mondjuk `tmux_startup.sh` és helyezzük el a projektünk mappájába, utána nyissuk meg egy szerkesztőben.

Először is hozzuk létre a sessiont:

```
#!/bin/bash
tmux new-session -d -s project_1
```

Ez létre is hozta a sessiont 'project\_1' néven, leválasztotta azt.

A következő parancs már a munkameneten belüli ablakokra fog vonatkozni. Mint szinte minden a számítástechnikában, ennek a számozása is 0-val kezdődik. Ebben fusson mondjuk a webpack, át is nevezzük az ablakot erre:

```
tmux rename-window -t project_1:0 webpack
```

A fenti parancsnál a -t adja meg, hogy melyik session és azon belül melyik ablakot akarjuk átnevezni, majd megadjuk a kivánt nevet is.

Ezután jön a következő lépés, hogy elindítsunk benne egy webpacket. Ehhez karakterleütéseket szimulálunk a tmux-al:

```
tmux send-keys -t project_1:0 "webpack -w --mode=development" C-m
```

Itt is megadjuk, hogy melyik session melyik ablakába akarunk billentyűleütéseket küldeni. A `C-m` egy kontroll kifejezés, ami az enternek a megfelelője, hiszen nem elég, hogy beirja helyettünk, jó volna ha el is inditaná, nem?

A következő már egy kicsit másabb lesz. Mikor elinditunk egy munkamenetet, abban automatikusan létrejön egy ablak, a 0-ás indexű. Ezért kellett csak átnevezni az első ablakot, viszont a többit már létre is kell hozni. Jöjjön a következő, ebben fusson a node, egy `npm serve` paranccsal.

```
tmux new-window -t project_1:1 -n "serve"
```

Látjuk, hogy most nem a 0-ás indexet, hanem az 1-est hozzuk létre és a -n után megadjuk a kivánt nevet.

Ezután már ugyanúgy működik, mint a korábbi esetben, küldjük oda a billentyűket:

```
tmux send-keys -t project_1:1 "npm run serve" C-m
```

Akkor már ez is indul, jöjjön az editor, ugyanúgy új ablakban:

```
tmux new-window -t project_1:2 -n "neovim"
tmux send-keys -t project_1:2 "nvim" C-m
```

Ezzel már a neovim is fut, az utolsó lépés pedig, hogy a logokat taileljük, amiket mondjuk az appunk a `logs/application.log` fájlba ir. Újabb ablak, aztán újra send-keys:

```
tmux new-window -t project_1:3 -n "logs"
tmux send-keys -t project_1:3 "tail -f logs/application.log" C-m
```

Az utolsó lépés pedig az, hogy hozzá is kapcsoljuk a tmux kliensünket a munkamenethez, amit az elején leválasztottunk, mert különben nem látjuk hogy mi is történik:

```
tmux attach-session -t project_1
```

Ezzel kész is van a kis startup script, ami elindit mindent ami a projekt fejlesztéséhez kell, nézzük egyben:

```
#!/bin/bash

# start new detached session
tmux new-session -d -s project_1

# webpack
tmux rename-window -t project_1:0 webpack
tmux send-keys -t project_1:0 "webpack -w --mode=development" C-m

# node
tmux new-window -t project_1:1 -n "serve"
tmux send-keys -t project_1:1 "npm run serve" C-m

# editor
tmux new-window -t project_1:2 -n "neovim"
tmux send-keys -t project_1:2 "nvim" C-m

# logs
tmux new-window -t project_1:3 -n "logs"
tmux send-keys -t project_1:3 "tail -f logs/application.log" C-m

# attach
tmux attach-session -t project_1
```

### Refaktor

Ha ránézünk, akkor már látjuk is, hogy sok ismétlődő érték van benne, ezért tudunk egy kicsit egyszerűsiteni a dolgon változók bevezetésével:

```
#!/bin/bash

session=project_1

# start new detached session
tmux new-session -d -s $session

# webpack
window=0
tmux rename-window -t $session:$window webpack
tmux send-keys -t $session:$window "webpack -w --mode=development" C-m

# node
window=1
tmux new-window -t $session:$window -n "serve"
tmux send-keys -t $session:$window "npm run serve" C-m

# editor
window=2
tmux new-window -t $session:$window -n "neovim"
tmux send-keys -t $session:$window "nvim" C-m

# logs
window=3
tmux new-window -t $session:$window -n "logs"
tmux send-keys -t $session:$window "tail -f logs/application.log" C-m

# attach
tmux attach-session -t $session
```

Igy ha újabb ablakot akarunk bevezetni vagy másolnánk a script részeit, akkor egyszerűbb dolgunk van.

Na de mi van akkor, ha kétszer futtatjuk a scriptet véletlenül? Vagy egy másik terminálban már fut, csak mi nem tudunk róla? Esetleg leválasztottuk a munkamenetet korábban, de elfelejtettük?  
Ezt úgy oldjuk meg, hogy ellenőrizzük, hogy ha már létezik a session, akkor nem kell létrehozni azt és bepötyögni itt mindent, hanem csak hozzá kell csatlakozni.  
Ezt úgy fogjuk megoldani, hogy lekérdezzük a munkamenetek listáját és ha megtaláljuk benne azt, amit épp létre akarunk hozni, akkor már létezik:

```
#!/bin/bash

session=project_1

if ! tmux list-sessions | grep -q $session;
then

    # start new detached session
    tmux new-session -d -s $session

    # webpack
    window=0
    tmux rename-window -t $session:$window webpack
    tmux send-keys -t $session:$window "webpack -w --mode=development" C-m

    # node
    window=1
    tmux new-window -t $session:$window -n "serve"
    tmux send-keys -t $session:$window "npm run serve" C-m

    # editor
    window=2
    tmux new-window -t $session:$window -n "neovim"
    tmux send-keys -t $session:$window "nvim" C-m

    # logs
    window=3
    tmux new-window -t $session:$window -n "logs"
    tmux send-keys -t $session:$window "tail -f logs/application.log" C-m

fi

# attach
tmux attach-session -t $session
```

Ha a fentit lefuttatjuk:

```
bash tmux-startup.sh
```

akkor megnyitja nekünk a 4 ablakos tmux munkamenetet benne a futó parancsokkal. Ha a `<prefix key>-d` segitségével leválasztjuk a kliensünket a munkamenetről, majd újra lefuttatjuk a scriptet, akkor ugyanazt fogjuk kapni, hiszen nem hozza létre újra az ablakokat és benne a parancsokat, azok futnak a háttérben.

Alapból a tmux nem a legszebb külsővel érkezik, de egy kis berhelés után a fenti munkamenet nézhet ki igy is (ahol épp a neovim van megnyitva ugyanazzal a gruvbox témával, mint amit a tmux is használ):

![](http://letscode.huassets/uploads/2022/03/Screenshot-2022-03-24-at-9.32.35.png)

### Projektek közti váltás

Na de mi a helyzet a másik projekttel? Meg hogy tudunk köztük váltogatni? Először is hozzuk létre a fenti séma szerint annak a startup scriptjét is, ami legyen `tmux-startup2.sh`:

```
#!/bin/bash

session=project_2

if ! tmux list-sessions | grep -q $session;
then

    # start new detached session
    tmux new-session -d -s $session

    # webpack
    window=0
    tmux rename-window -t $session:$window webpack
    tmux send-keys -t $session:$window "webpack -w --mode=development" C-m

    # editor
    window=1
    tmux new-window -t $session:$window -n "neovim"
    tmux send-keys -t $session:$window "nvim" C-m

    # cordova
    window=2
    tmux new-window -t $session:$window -n "cordova"
    tmux send-keys -t $session:$window "cdvlive android" C-m

fi

# attach
tmux attach-session -t $session
```

A munkameneteket elvileg lehet egymásba ágyazni, de az olyasvalami, amit nem szeretnénk most, igy első lépésként a korábbi munkamenetet válasszuk le, a `<prefix key> -d`-vel, majd futtassuk le a második scriptet:

```
bash tmux-startup2.sh
```

Ez ugyanúgy megnyit egy ilyen munkamenetet a script mentén három ablakkal. Hogy tudunk váltani közöttük? Erre a `<prefix key>-s `(azaz select) lesz a módszer, ami egy kis előnézetet is ad az egyes munkameneteknél, hogy választhassunk köztük, hogy az adott kliens ami a terminálban fut melyikhez is csatlakozzon. Innen a q-val tudunk kilépni, az x-el tudjuk az adott munkamenetet lelőni és az enterrel kiválasztjuk amelyiket épp akarjuk használni. Tehát pár gombnyomással tudunk a projektek között váltani egy adott terminálon belül. Mennyire király már?

### Hova tovább?

A fenti példát tovább is lehetne vinni, ha pl. a $PATH-ra kerülnek a fenti scriptek és a küldött parancsok az aktuális projekt mappába lépnek, esetleg bevárnak valamit, pl. a `cdvlive android` egy emulátorra telepiti az alkalmazást, aminek futnia kell, ehhez pedig a genymotion player CLI scriptjével el kell inditani a VM-et, ha még nem fut és igy tovább.  
Sőt, igazán nagyban is lehet gondolkozni és konténerizálni az egészet és akkor egyetlen konténert és hozzá a runtime-ot kell letöltenie az újonnan érkező fejlesztőknek és máris eshetnek neki a projektnek.