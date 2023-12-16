---
id: 846
title: 'Scooter &#8211; Back it up'
date: '2015-12-17T23:27:05+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=846'
permalink: /2015/12/17/scooter-back-it-up/
dsq_thread_id:
    - '4413010065'
    - '4413010065'
tie_post_bg:
    - ''
    - ''
tie_post_color:
    - ''
    - ''
tie_gallery_style:
    - slider
    - slider
tie_link_url:
    - ''
    - ''
tie_link_desc:
    - ''
    - ''
tie_video_url:
    - ''
    - ''
tie_embed_code:
    - ''
    - ''
tie_audio_mp3:
    - ''
    - ''
tie_audio_m4a:
    - ''
    - ''
tie_audio_oga:
    - ''
    - ''
tie_audio_soundcloud:
    - ''
    - ''
tie_quote_author:
    - ''
    - ''
tie_quote_link:
    - ''
    - ''
tie_quote_text:
    - ''
    - ''
tie_status_facebook:
    - ''
    - ''
tie_status_twitter:
    - ''
    - ''
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2015/12/09201939/Coloradobrandtapedrive.jpg'
categories:
    - Backend
tags:
    - backup
    - files
    - mysqldump
    - recovery
    - restore
    - sql
---

A biztonsági mentés és visszaállítás létfontosságú<del> aki azt mondja, hogy nem, az fütyül és/vagy hazudik</del>. A legtöbben saját kárukon tanulják meg mindezt, mikor is végleg oda lesz valamennyi adatuk. Cikkünkben a backup módszereit tárgyaljuk ki és végignézünk pár eszközt is a területen.[![Coloradobrandtapedrive](assets/uploads/2015/12/Coloradobrandtapedrive-1024x598.jpg)](assets/uploads/2015/12/Coloradobrandtapedrive.jpg)

Mielőtt azonban eszközt és/vagy módszert választanánk, tegyük fel magunknak a kérdést:

- **Miért?** Miért is akarunk az adatvesztés ellen védekezni? Számít az, ha oda lesznek az adataink? Mennyire fájna, ha oda lenne minden?
- **Mit?** Mit is akarunk menteni? A komplett meghajtót vagy csak egy private key-t?
- **Mikor?** Mikor is lenne érdemes biztonsági mentést csinálni a rendszerről? Milyen sűrűn? Mikor használnánk a teljes mentést és mikor inkrementálisat?
- **Hova?** A biztonsági mentés hol tárolódna? Felhőben? A szerveren?
- **Adathordozó?** Backup szerver vagy valami más? USB-stick, külső HDD, szalag?

#### A backupok típusai

A backupoknak több fajtája van, ezek közül kell kiválasztani a számunkra legmegfelelőbbet az alapján, hogy melyik is illeszthető jobban az igényeinkre:

- Recovery time objective (RTO) : Milyen gyorsan kell visszaállítnai az adatokat? Ha odalesznek, mennyi ideig tudunk meglenni a visszaállításig<del> anélkül, hogy az ügyfelek meglincselnének</del>?
- Recovery point objective (RPO) : Mennyi adat veszhet oda? Két óra alatt keletkezett adatot kibírunk? Netán két napot vagy épp két hetet?

> Ha a blogunkba minden héten posztolunk egyet és a commenteket nem ezen a szerveren tároljuk, akkor kb. hetente elég egy backup. Ha minden nap születnek új cikkek, sőt a kommentek is özönlenek, akkor bizony minden éjjel ajánlott biztonsági mentést csinálni.

**Teljes:** A célkönyvtár/meghajtó összes fájlja mentésre kerül.

**Inkrementális:** Azokról a fájlokról készül csak mentés, amik változtak a legutolsó mentés óta.

**Differenciál:** Azokról a fájlokról készül mentés, amik a legutóbbi **teljes** mentés óta változtak.

#### Backup módszerek

A pénzügyi helyzetünktől és a választott stratégia mentén választhatunk:

- **manuális:** A manuális mentést maguk a felhasználók <del>protokoll droidok</del> fogják végezni a felhasználó által meghatározott időpontokban. Ez a legmegbízhatatlanabb módszer<del>, hiszen a párologtatók bináris nyelve nem csak játék és mese.</del> viszont a legtöbbet használt az átlagfelhasználók körében.
- **lokális automatizált:** Automatizált mentés, ami egy külső meghajtóra, szalagra ment x időközönként. Apróbb cégek vagy hobbi<del>t</del> rendszergazdák használják.
- **távoli automatizált:** Automatizált mentés, ami egy helyi meghajtó tartalmát menti le egy távoli gépen lévő adathordozóra. Ezt főleg azok a cégek használják, akiknek van erőforrásuk kialakítani ezt a rendszert.

####  Visszaállítás

Sokan a biztonsági mentések esetében csak addig jutnak el, hogy mentsék az adatot, de azzal nem foglalkoznak, hogy vajon abból a mentésből az adataink visszaállíthatóak-e?

> Tegyük fel, hogy elmentjük az egyik SQL adatbázisunkhoz tartozó könyvtárat. Majd mikor ezt visszamásoljuk jövünk csak rá, hogy az ibdata fájl nélkül ezek corrupted táblákat tartalmaznak csupán.

Fontos megemlíteni, hogy rendkívül fontos, hogy a mentéseinket leteszteljük visszaállítással. Alább álljon pár példa, amivel lehet tesztelni azt:

- Állítsunk vissza több fájlt.
- Állítsuk vissza egy fájl régebbi állapotát.
- Állítsunk vissza egy komplett könyvtárat.
- Állítsuk vissza a komplett meghajtót és checksum alapján vessük össze a tartalmát
- [![Back Up And Restore Keys For Computer Data Security](assets/uploads/2015/12/backup_restore-1024x1024.jpg)](assets/uploads/2015/12/backup_restore.jpg)

Na de akkor nézzük, hogy is lehet ezeket megvalósítani különböző szinteken, a legegyszerűbbtől a legkomplexebb felé.

Az alapállapot, hogy Pistike összeszedi a gépén évek folyamán összekuporgatott <del>pornót</del> családi videókat és kiírja azt egy DVD-re. Egy napon bad sectoros lesz a vinyója, pont az egyik videó közepén, amit innen kezdve nem tud rendesen lejátszani. Lecseréli a HDD-t és lévén a DVD-n megvannak a videók, ezért teljes nyugalomban hajíthatja ki a régit. <del>Persze itt a kérdés, hogy Pistike miért nem RAID-be kötve tolta az ipart?</del>

Ahogy telnek az évek, Pistike elkezd weboldalakat patkolni, remélhetőleg nem wordpress alapokon. Befizet egy kis 512-es VPS-re, fellő rajta egy cpanelt, mert a linuxhoz nem nagyon ért és jobb szereti a webes felületeket. Itt kézzel néha-néha nyom egy exportot az egyes adatbázisokról phpmyadminon. A saját gépén van a forráskód, ami a biztonsági mentést is jelenti egyben, így ha a szervert valaki feltöri és telespammeli wp\* fájlokkal, netán encrypteli azokat, akkor csak felcsapja a macbook-ja tetejét és feltolja FTP-n a fájlokat, hiszen azok nem nagyon változnak.. elvileg.

De mi a helyzet a felhasználók által feltöltött tartalommal és az SQL dolgaival? Visszamásolja amit talált a gépen, meg az SQL-t is lecseréli a saját kis mentésére, de az ügyfelek már hívogatják is, hogy bizony ez így nem járja, a sablon üzemeltetési szerződésen nem erről volt ám szó, ugyanis itt hetek teltek el a biztonsági mentések óta.

Pistike ezért úgy dönt, hogy utánajár a dolgoknak és némileg automatizálja a dolgot. Leporolja a putty-ot és belép a linux termináljába.

Első körben megnyitja a crontab fájlt rootként:

```
sudo crontab -e
```

> Persze itt használhatunk más felhasználók cronját is, sőt! létrehozhatunk egyedi usert a mentésekre.

Majd felveszi annak a végére, hogy minden nap éjfélkor futtasson le egy backup.sh nevű scriptet a rendszer.

```
0 0 * * * /usr/src/backup.sh
```

Aztán megnyitja nanoval azt a bizonyos scriptet és copy-pasteli az első találatot a mysqldump parancsra google-ről:

```
#!/bin/sh

FILE=/var/backups/minime.sql.`date +"%Y%m%d"`
DBSERVER=127.0.0.1
DATABASE=XXX
USER=XXX
PASS=XXX

mysqldump --opt --user=${USER} --password=${PASS} ${DATABASE} > ${FILE}

gzip $FILE
```

Ezzel az sql **full backup** le is van tudva. Minden nap éjfélkor lefut, csinál 1 adatbázisról egy dumpot és jónapot. Ha akarunk többet felvehetünk és a probléma megoldva, nemde?

**Mi ezzel a probléma?**

Elsősorban a hely. Gondoljunk bele, hogy ez egy nagyra hízott adatbázisnál minden egyes napon készít egy teljes replikát és noha tömöríti, redundancia hegyeket építünk. Valamint a biztonsági mentéseknél sokan nem tekintik szempontnak azt, hogy a mentés és a mentett adatok között minél nagyobb távolság legyen. Itt nem szektorokra, hanem kilométerekre gondolok. Ha valaki feltöri a gépet, netán elszáll teljesen, akkor azon a hordozón található összes backup is elszáll. Ha leég az épület, akkor a szerverteremben mindennek lőttek. Ha bombát dobnak a városra, akkor valszeg a város összes szervertermének lőttek. Viszont egy másik kontinensen az adataink ott lesznek. Persze ez kissé Mr. Robotos, de remélem érthető. *Ennélfogva ez a lokális backup nem az igazi, na meg a megvalósítás is kissé fapados.*

Akik néha belépnek és törlik a régi backupokat, meg nincsenek hely szűkében, netán apró adatbázisokkal dolgoznak, azoknak a fenti script is tökéletes lehet, kiegészítve egy plusz tarball gyúrogatással:

```
cd /var/www
tar -cfz website-name`date +"%Y%m%d"`.tgz website-dir
mv /var/www/website-name`date +"%Y%m%d"`.tgz /usr/backups/website-name`date +"%Y%m%d"`.tgz
```

Első lépésként ennyit szerettem volna, legközelebb pistike jobban utánajár a dolgoknak és konkrét célszoftverek jönnek, [amanda](http://amanda.org), [rsync ](http://linux.die.net/man/1/rsync) és [bacula](http://blog.bacula.org/).