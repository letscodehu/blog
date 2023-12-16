---
id: 2195
title: 'Kalandozások Vimmel'
date: '2020-04-04T18:16:45+02:00'
author: tacsiazuma
layout: post
guid: '/?p=2195'
permalink: /2020/04/04/kalandozasok-vimmel/
newsphere-meta-content-alignment:
    - align-content-left
amazonS3_cache:
    - 'a:16:{s:65:"//www.letscode.huassets/uploads/2020/03/2020-03-29_11-45.png";a:2:{s:2:"id";i:2196;s:11:"source_type";s:13:"media-library";}s:74:"//www.letscode.huassets/uploads/2020/03/2020-03-29_11-45-1024x571.png";a:2:{s:2:"id";i:2196;s:11:"source_type";s:13:"media-library";}s:88:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/03/29114711/2020-03-29_11-45.png";a:2:{s:2:"id";i:2196;s:11:"source_type";s:13:"media-library";}s:97:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/03/29114711/2020-03-29_11-45-1024x571.png";a:2:{s:2:"id";i:2196;s:11:"source_type";s:13:"media-library";}s:65:"//www.letscode.huassets/uploads/2020/03/2020-03-29_11-46.png";a:2:{s:2:"id";i:2197;s:11:"source_type";s:13:"media-library";}s:74:"//www.letscode.huassets/uploads/2020/03/2020-03-29_11-46-1024x559.png";a:2:{s:2:"id";i:2197;s:11:"source_type";s:13:"media-library";}s:88:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/03/29114722/2020-03-29_11-46.png";a:2:{s:2:"id";i:2197;s:11:"source_type";s:13:"media-library";}s:97:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/03/29114722/2020-03-29_11-46-1024x559.png";a:2:{s:2:"id";i:2197;s:11:"source_type";s:13:"media-library";}s:54:"//www.letscode.huassets/uploads/2020/04/image.png";a:2:{s:2:"id";i:2207;s:11:"source_type";s:13:"media-library";}s:63:"//www.letscode.huassets/uploads/2020/04/image-1024x604.png";a:2:{s:2:"id";i:2207;s:11:"source_type";s:13:"media-library";}s:77:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/04/04163310/image.png";a:2:{s:2:"id";i:2207;s:11:"source_type";s:13:"media-library";}s:86:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/04/04163310/image-1024x604.png";a:2:{s:2:"id";i:2207;s:11:"source_type";s:13:"media-library";}s:56:"//www.letscode.huassets/uploads/2020/04/image-1.png";a:2:{s:2:"id";i:2211;s:11:"source_type";s:13:"media-library";}s:65:"//www.letscode.huassets/uploads/2020/04/image-1-1024x540.png";a:2:{s:2:"id";i:2211;s:11:"source_type";s:13:"media-library";}s:79:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/04/04175654/image-1.png";a:2:{s:2:"id";i:2211;s:11:"source_type";s:13:"media-library";}s:88:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/04/04175654/image-1-1024x540.png";a:2:{s:2:"id";i:2211;s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2020/03/29114722/2020-03-29_11-46.png'
categories:
    - 'Kocka élet'
tags:
    - ide
    - java
    - php
    - vim
---

A szokásostól eltérő bejegyzés következik tőlem, mert ennek most nem feltétlenül a tudás átadása a célja, mintsem inkább egy kis történet, vagy épp folyamat megosztása. Ez a folyamat pedig nem más, mint a Vim szerkesztő elsajátítása, már amennyire egyelőre annak lehet nevezni, kb. két hét után. De ne rohanjunk ennyire előre, kezdjük az elején. Az már köztudott, hogy a Vim tanulási görbéje igencsak meredek.

<figure class="wp-block-image">![Post image](https://i.redd.it/iwnxj554bng41.png)<figcaption>Vim tanulási görbe egy kis typoval fűszerezve</figcaption></figure>Ezért, habár korábban voltak is nagyon rövidke próbálkozások, valahogy hiányzott az elhatározás mögüle és emiatt igen korán feladtam. A legutolsó löket egy slackes beszélgetéssel indult, ahol valaki belinkelt egy cikket arról, hogy valaki lecserélte a PHPStormot a Vimre. Na itt már én is felkaptam a fejem, ugyanis a JetBrains termékek rendkívül megkönnyítik az életem és ha valaki ezeket is eldobja, akkor az már valamit jelenthet. Nem szándékozom összehasonlítani a két szoftvert, ezt mindenki maga eldöntheti majd. Részben magamra ismertem a cikkben, mert az írója sem tíz ujjal gépelt (ez nálam kb. 5-6 volt) és a Vim tanulását egy kis tízujjas gyakorlással egybekötve ajánlotta. Ezt meg is fogadtam, a [keybr.com](http://keybr.com)-on neki is láttam leszoktatni magamat erről a "rossz" szokásról, ami azóta is tart, hiszen két hét alatt nem fogjuk megváltani a világot és több évtizednyi izommemóriát nem könnyű legyűrni.

**Elvárások**

Mégis mit vártam tőle? A legtöbbet használt funkciókat modern IDE-kből. Autocomplete, automatikus import, autoformat, fordítási hibák jelzése, könnyű refaktor, valami gyorskeresőt, snippetek, git integráció, tesztek futtatása.. tehát igazából az alapokat. Vajon tudja ezt egy "egyszerű" szerkesztő? Természetesen ha csak ezeket tudja, akkor még mindig kérdés, hogy miért éri meg váltani, hiszen nem fog valaki hónapokat tölteni azzal, hogy elsajátítson egy új eszközt, csak azért, hogy pontosan ugyanannyira legyen produktív, mint előtte. Le akartam szokni az egérhasználatról is, hiszen minden alkalommal, amikor kinyúl az ember érte, egy apró törést okoz. Na meg úgyis ott van előttem a billentyűzet, hát miért ne tudnám megtenni ott? Nos Vimben kb. MINDENT meg lehet oldani csak a billentyűzet segítségével, amit pedig nem tud alapból, vagy éppen pluginek segítségével, arra ott a vimscript, amivel mi is tudunk mindenfélét hozzáadni.

A Vim cheatsheet amúgy igencsak ajánlott, kinyomtatva az asztalon, vagy ami mégjobban segít, minden napra egy parancsot kiszemelni és azt gyakorolni, még ha nincs is rá szükség, hogy rögzüljön.

Amikor az ember cikkeket olvas a Vimről vagy éppen videókat néz róla, akkor szinte sosem azt látja, mint amit az első telepítéskor/megnyitásakor. A Vim alapból is rengeteg mindent tud, de ami igazán naggyá teszi, azok a pluginek. Ezekkel teletűzdelve fogunk leginkább vele találkozni. Aztán alig várjuk, hogy mi is kipróbáljuk az adott témát/betűtípust/plugint vagy bármi mást.

<figure class="wp-block-image size-large">![](assets/uploads/2020/03/29114711/2020-03-29_11-45-1024x571.png)<figcaption>Vim darcula témával és egy jópár pluginnel, még az unused importot is jelzi a 6. sorban.</figcaption></figure><figure class="wp-block-image size-large">![](assets/uploads/2020/03/29114722/2020-03-29_11-46-1024x559.png)<figcaption>Ahogy az ember találkozik vele először</figcaption></figure>Először a sima Vim 8.x verziójával próbálkoztam, különböző cikkekből összeollózva a dolgokat. Később ezt lecseréltem a [neovimre](https://neovim.io/), mert könnyebb volt összelőni bizonyos pluginekkel. A konfigurációs fájl, amit szinte mindenhez piszkálni kell az a home mappánkban levő .vimrc, ami alapból nem is létezik. Ebbe kell felvennünk plugineket, azok beállításait és még sok mást. A pluginmenedzsmenthez a [Vundle](https://github.com/VundleVim/Vundle.vim)-t használtam, amit egy sima git clone segítségével telepítettem.

Még nem jutottam el arra a szintre, hogy olyan szépen rendezett vimrc fájlom legyen, mint azoknak, akik bátran osztják meg a sajátjaikat githubon, de valamennyire próbálom rendszerezni mindezt, mert ha tényleg leváltom a korábban használt IDE-t, akkor szinte ez lesz az egyik legfontosabb konfigurációs fájl, amit az évek során szerkesztgetek és magamal hurcolok majd. Nem is hittem volna, hogy ennyi mindent testreszabok majd menet közben, ami nem tetszik vagy éppen jobb lenne, ha másképp működne. Az egyik igen gyakran használt billentyű pl. az Escape, ami igencsak kiesik, ezért az a szokás, hogy egy másik kevésbé használt billentyűt mappelnek rá. Nálam se volt ez másképp, a Caps Lock jutott erre a sorsra, amit linuxon az alábbi módszerrel oldottam meg a terminálból:

`dconf write "/org/gnome/desktop/input-sources/xkb-options" "['caps:escape']"`

Ugyanerre Macen a Karabiner-Elementset használtam, így a Caps Lock ott is az Escapet jelenti. Mondanom sem kell, azóta kevesebbet is ordítozok a neten. Ha már az escapenél járunk, akkor itt meg kell jegyezni azt is, hogy a neovim terminál kezelésével is voltak bajaim, mert az alap Escape ott nem lépett ki Normal módba, így a .vimrc-ben a következő sorral oldottam meg, hogy amennyiben a terminál az aktív ablak, az Esc leütése igazából egy Ctrl-\\-t követő Ctrl-N legyen.

`:tnoremap <Esc> <C-\><C-n>`

Furcsa, de már két hét után a vim-ből használt billentyűkombinációkat használnám a navigációra még itt a wordpress kezelőfelületén is. Apropó navigáció: ha már elindultam a mouseless irányba, letöltöttem egy böngészőplugint is, a Vimiumot, aminek segítségével a Vimből már ismert billentyűkombinációk segítségével tudok navigálni az oldalon. Innen az F billentyű az egyik leghasznosabb, ugyanis azzal ki lehet emelni azokat az elemeket az oldalon, amikkel interakcióba lehet lépni és billentyűkombinációkat rendel hozzá, amiket leütve rá tudunk bökni, mindezt egér nélkül.

<figure class="wp-block-image size-large">![](assets/uploads/2020/04/04163310/image-1024x604.png)<figcaption>Egy github commit részletezése, Vimium pluginnel, az F billentyű lenyomása után.</figcaption></figure>Természetesen ha éppen egy input mezőben vagyunk, akkor a legtöbb billentyűkombináció inaktív, hiszen akkor beszélgetés közben ide-oda ugrálnánk az ablakok/tabok között.

**Jelen állapot**

Na de hol járok most az eddigiekkel?

**Autocomplete? ✅**

A [CoC](https://github.com/neoclide/coc.nvim) nevű plugin, ami Node.Js alapú, a kiegészítőin keresztül lehetőséget biztosít kódkiegészítésre számos program és leírónyelvhez, mint pl. PHP, Java, CSS, Vue és még sorolhatnám. Ha a coc-java kiegészítő le van töltve és be van kapcsolva, akkor az első Java fájl megnyitásakor tölti is le a [Java language servert](https://github.com/eclipse/eclipse.jdt.ls) és már indítja is.

**Autoformat ✅**

Az [autoformat](https://github.com/Chiel92/vim-autoformat) plugin segítségével megoldható, sőt itt már ki is egészítettem, hogy hasonlóan működön, mint az IntelliJ, tehát ne csak a fájlokat formázza meg, hanem pl. a nem használt importokat is törölje, mindezt az F3 lenyomására:

`noremap  :exec 'UnusedImportsRemove'<bar>Autoformat<CR>`

A fenti formatter egyébként külső programokat használ, pl. Java esetében az [astyle](http://astyle.sourceforge.net/)t.

**Fordítási hibák jelzése ✅**

Az [A.L.E.](https://github.com/dense-analysis/ale) plugin segítségével ez is megoldható. Sőt, nem csak a fordítási, de pl. a Checkstyle és PMD is bekonfigurálható. Ez pedig még nem minden, könnyen beköthetjük egy billentyűkombinációra, hogy amit tud ezekből meg is fixáljon automatikusan.

**Snippetek** **✅**

Ki ne gondolná, de erre is van [plugin](https://github.com/SirVer/ultisnips), aminek a segítségével tudunk különböző fájlkiterjesztésekhez rövidítéseket és hozzájuk snippeteket rendelni.

**Gyorskereső ✅**

Itt igazából két plugint is megemlítenék, az [egyik](https://github.com/mileszs/ack.vim) a fájlok tartalmában, a [másik](https://github.com/kien/ctrlp.vim) pedig azok nevében keres.

<figure class="wp-block-image">![ctrlp](https://camo.githubusercontent.com/0a0b4c0d24a44d381cbad420ecb285abc2aaa4cb/687474703a2f2f692e696d6775722e636f6d2f7949796e722e706e67)<figcaption>CtrlP plugin, amivel gyorsan tudunk fájlrendszerben, megnyitott és gyakran használt fájlokban keresni</figcaption></figure><figure class="wp-block-image size-large">![](assets/uploads/2020/04/04175654/image-1-1024x540.png)<figcaption>Ack.vim plugin, amivel az ack programot tudjuk vimből használni és navigálni a találatok között</figcaption></figure>**Git integráció** **✅**

Itt megint két plugint említenék meg. Az [egyik](https://github.com/tpope/vim-fugitive) a git parancsokra, diffelésre, logokra, blamere jó, míg a [másik](https://github.com/airblade/vim-gitgutter) a többi editorhoz hasonlóan jelzi a módosításainkat az adott fájlban a repositoryhoz képest.

<figure class="wp-block-image">![https://raw.githubusercontent.com/airblade/vim-gitgutter/master/screenshot.png](https://raw.githubusercontent.com/airblade/vim-gitgutter/master/screenshot.png)<figcaption>vim-gitgutter plugin, a sorszámozás mellett láthatóak a változások</figcaption></figure>**Tesztek futattása** **✅**

Erre a [vim-test](https://github.com/janko/vim-test) plugint és a [vim-dispatch](https://github.com/tpope/vim-dispatch)et használom. Ez pl. a Ctrl-T billentyűkombinációra van nálam kötve, ami lefuttatja az adott fájlban taláhlató teszteket. Persze ez is egyéni preferencia kérdése, mert le lehet futtatni teszteket név alapján, a kurzorhoz legközelebb levőt és... sorolhatnám. Itt is van egy kis extra konfigurációm a .vimrc-ben, hogy jobban igazodjon az én igényeimhez. Itt arra gondolok, hogy akadnak olyan integrációs tesztek a projektben, amik suiteban futnak és a suite elején indul a hozzájuk tartozó MySQL, így önállóan nem futtathatóak. Ehhez már kis vimscriptet is kellett írjak.

**Refaktorálás** ❌

Ez az, amit még nem próbáltam ki, de elvileg erre is [ott](https://github.com/apalmer1377/factorus) a plugin. Mivel még nem értem a történet végére, ezért lehet még ez is változik és azt is természetesen megírom.

Mit is látok eddig? Munkás, de megéri. Olyan, mintha kaptam volna valami új kütyüt, amit lehet ide-oda tekergetni. Nulláról indulva hetek kellenek ahhoz, hogy valaki ugyanolyan produktív legyen vimben, mint egy modern IDE-ben (már ha azt kellően kihasználta, ha nem, akkor lehet hamarabb is eljön ez az idő). Nem is ajánlom senkinek, hogy rögtön valami szoros határidős projekt mellett kezdje el ezt a munkahelyén használni. Egyelőre én is szabadidőmben tweakelem, ahogy felmerülnek az új és új ötletek, amiket még lehetne benne csinálni és fokozatosan viszem be az éles fejlesztésbe.

Persze itt tovább lehet menni, hogy méginkább elszakadjunk az egértől. Itt jön képbe pl. az [i3](https://i3wm.org) ablakkezelő (vagy macre az [Amethyst](https://ianyh.com/amethyst/), bár az közel sem tud annyit), amivel szintén billentyűkombinációk segítségével lehet navigálni és feladatokat végezni. Ezt speciel még nem tettem fel, mert hirtelen nagy ugrás lenne, ha ezt is beiktatnám a napi tanulási folyamatba, de ha már biztosabbnak érzem magam vimben, akkor jöhet ez is.

<figure class="wp-block-image">![](https://i3wm.org/screenshots/i3-9.png)<figcaption>i3 ablakkezelő akcióban, git log, vim és egy médialejátszó</figcaption></figure>