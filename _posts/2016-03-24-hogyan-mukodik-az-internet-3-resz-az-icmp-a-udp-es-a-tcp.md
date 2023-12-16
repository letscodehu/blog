---
id: 539
title: 'Hogyan működik az Internet, 3. rész: az ICMP, a UDP és a TCP'
date: '2016-03-24T07:00:41+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=539'
permalink: /2016/03/24/hogyan-mukodik-az-internet-3-resz-az-icmp-a-udp-es-a-tcp/
dublin_core_author:
    - 'Enter author here'
dublin_core_title:
    - 'Enter title here'
dublin_core_publisher:
    - 'Enter publisher here'
dublin_core_rights:
    - 'Enter rights here'
pyre_show_first_featured_image:
    - 'yes'
pyre_portfolio_width_100:
    - default
pyre_video:
    - ''
pyre_fimg_width:
    - ''
pyre_fimg_height:
    - ''
pyre_image_rollover_icons:
    - default
pyre_link_icon_url:
    - ''
pyre_post_links_target:
    - 'no'
pyre_related_posts:
    - default
pyre_share_box:
    - default
pyre_post_pagination:
    - default
pyre_author_info:
    - default
pyre_post_meta:
    - default
pyre_post_comments:
    - default
pyre_main_top_padding:
    - ''
pyre_main_bottom_padding:
    - ''
pyre_hundredp_padding:
    - ''
pyre_slider_position:
    - default
pyre_slider_type:
    - 'no'
pyre_slider:
    - '0'
pyre_wooslider:
    - '0'
pyre_revslider:
    - '0'
pyre_elasticslider:
    - '0'
pyre_fallback:
    - ''
pyre_avada_rev_styles:
    - default
pyre_display_header:
    - 'yes'
pyre_header_100_width:
    - default
pyre_header_bg:
    - ''
pyre_header_bg_color:
    - ''
pyre_header_bg_opacity:
    - ''
pyre_header_bg_full:
    - 'no'
pyre_header_bg_repeat:
    - repeat
pyre_displayed_menu:
    - default
pyre_display_footer:
    - default
pyre_display_copyright:
    - default
pyre_footer_100_width:
    - default
pyre_sidebar_position:
    - default
pyre_sidebar_bg_color:
    - ''
pyre_page_bg_layout:
    - default
pyre_page_bg:
    - ''
pyre_page_bg_color:
    - ''
pyre_page_bg_full:
    - 'no'
pyre_page_bg_repeat:
    - repeat
pyre_wide_page_bg:
    - ''
pyre_wide_page_bg_color:
    - ''
pyre_wide_page_bg_full:
    - 'no'
pyre_wide_page_bg_repeat:
    - repeat
pyre_page_title:
    - default
pyre_page_title_text:
    - default
pyre_page_title_text_alignment:
    - default
pyre_page_title_100_width:
    - default
pyre_page_title_custom_text:
    - ''
pyre_page_title_text_size:
    - ''
pyre_page_title_custom_subheader:
    - ''
pyre_page_title_custom_subheader_text_size:
    - ''
pyre_page_title_font_color:
    - ''
pyre_page_title_height:
    - ''
pyre_page_title_mobile_height:
    - ''
pyre_page_title_bar_bg:
    - ''
pyre_page_title_bar_bg_retina:
    - ''
pyre_page_title_bar_bg_color:
    - ''
pyre_page_title_bar_borders_color:
    - ''
pyre_page_title_bar_bg_full:
    - default
pyre_page_title_bg_parallax:
    - default
pyre_page_title_breadcrumbs_search_bar:
    - default
fusion_builder_status:
    - inactive
refaktor_post_views_count:
    - '7047'
avada_post_views_count:
    - '7048'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
amazonS3_cache:
    - 'a:4:{s:61:"//www.letscode.huassets/uploads/2016/03/ip-stack.001.png";a:2:{s:2:"id";i:545;s:11:"source_type";s:13:"media-library";}s:84:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2016/03/29122715/ip-stack.001.png";a:2:{s:2:"id";i:545;s:11:"source_type";s:13:"media-library";}s:57:"//www.letscode.huassets/uploads/2016/03/3way.001.png";a:2:{s:2:"id";s:4:"2049";s:11:"source_type";s:13:"media-library";}s:80:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2016/03/29122721/3way.001.png";a:2:{s:2:"id";s:4:"2049";s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2016/03/29122709/16221553_m.jpg'
categories:
    - Alapozó
tags:
    - icmp
    - ip
    - tcp
    - udp
---

Az [előző cikkeinkben](/hogyan-mukodik-az-internet-2-resz-az-internet-protokoll/) azzal foglalkoztunk, hogy a csomagok hogyan találnak a megfelelő helyre az Interneten. Most végre elérkezett az idő, hogy megnézzük mire is lesz ez jó. Ezúttal három, IP-re épülő protokollt nézünk meg: az ICMP-t, a UDP-t és a TCP-t.

![ip-stack.001](assets/uploads/2016/03/29122715/ip-stack.001.png)

Mint az egymásra épülő protokolloknál szokás, mind a három az IP protokollra épül. Ez azt jelenti, hogy az itt tárgyalt adatcsomagok mind-mind egy IP csomagban foglalnak helyet. Ennek tudatában kezdjük el a legegyszerűbbel.

## Az Internet Control Message Protocol (ICMP)

Az ICMP tulajdonképpen nem más, mint egy segédprotokoll az Internet karbantartásához. A leginkább ismert felhasználása a *ping* parancs, amivel ellenőrizni lehet, hogy egy adott eszköz IP szerint elérhető-e.

Műszakilag egy ICMP csomag nem tartalmaz túl sok mindent:

- Csomag típus (1 byte)
- Csomag kód (1 byte)
- Ellenőrzőszám (2 byte)
- Kiegészítő fejlécek (4 byte)
- Payload

A csomag típus és kód együtt adja meg a küldött üzenet feladatát. Például a 3-as típus (célpont elérhetetlen), és ezzel együtt az 1-es kód adja meg, hogy a céleszköz nem elérhető. Az erre vonatkozó kiegészítő információk a csomag végén találhatóak. Szokás szerint a teljesség igénye nélkül nézzünk meg néhány érdekesebb kódot:

|  | <th>Típus</th> |  | <th>Kód</th> |  | <th>Leírás</th> |  |
|---|-----------------|---|---------------|---|-------------------|---|
|  | 0 – Echo Reply |  | 0 |  | Válasz egy echo (ping) kérésre. |  |
|  | 3 – Destination Unreachable (a cél nem elérhető) |  | 0 - Destination network unreachable |  | A célhálózat nem elérhető. Ez lehet például azért, mert a célhálózat routere nem üzemel. |  |
|  | 1 - Destination host unreachable |  | A céleszköz nem elérhető. Ez lehet például egy tűzfal miatt, vagy a céleszköz nem üzemel. |  |
|  | 2 - Destination protocol unreachable |  | A célprotokoll nem elérhető. |  |
|  | 3 - Destination port unreachable |  | A cél port nem elérhető. Ez jó eséllyel egy tűzfal miatt van. |  |
|  | 4 - Fragmentation required |  | Egy adatcsomagot nem sikerült elküldeni, mert ehhez darabolás (fragmentation) lenne szükséges, de az eredeti csomagon be volt állítva a Don't Fragment bit. |  |
|  | 6 - Destination network unknown |  | A célhálózat nem ismert. |  |
|  | 7 - Destination host unknown |  | A céleszköz nem ismert. |  |
|  | 9 - Network administratively prohibited |  | A célhálózat adminisztratív korlátozás miatt nem elérhető |  |
|  | 10 - Host administratively prohibited |  | A céleszköz adminisztratív korlátozás miatt nem elérhető |  |
|  | 8 – Echo Request |  | 0 |  | Echo (ping) kérés |  |
|  | 11 – Időtúllépés |  | 0 - TTL expired in transit |  | A küldött csomag túllépte a maximális ugrások számát. |  |

> **Tudtad?**  
> Az ICMP-nek az UDP-vel és a TCP-vel ellentétben van egy kifejezetten IPv6-ra készített változata. Mivel ez csak minimálisan különbözik a régi ICMP-től, ezt itt nem tárgyaljuk.

### Írjunk ICMP-t programból!

Természetesen messze nem vállalkozhatunk egy teljes körű ICMP implementációra, de egy kis ping programot azért össze tudunk hozni. A polgárpukkasztási tényező növeléséért egy olyan nyelvet választunk ehhez, ami egyáltalán nem ilyesmire való: a PHP-t.

A program talán egyetlen nehézsége az ellenőrzőszám előállítása, ami némi bit tologatást igényel:

```
function calculateICMPChecksum($header, $payload) {
    // Convert everything to 16 bit big endian numbers
    $numbers = unpack('n*', $header . $payload);
 
    $sum = 0;
    foreach ($numbers as $number) {
        $sum += $number;
    }
    $sumBinary = str_pad(decbin($sum), 16, '0', STR_PAD_LEFT);
    // Handle carry bits
    if (strlen($sumBinary) > 16) {
        while (strlen($sumBinary) > 16) {
            $sum       = bindec(substr($sumBinary, strlen($sumBinary) - 16, 16));
            $carry     = bindec(substr($sumBinary, 0, strlen($sumBinary) - 16));
            $sum      += $carry;
            $sumBinary = str_pad(decbin($sum), 16, '0', STR_PAD_LEFT);
        }
    }
    // Calculate the 1s complement of the sum
    $sumBinary = strtr($sumBinary, array('0' => '1', '1' => '0'));
 
    // Convert the string representation back to 16 bit binaries
    $checksum = pack('n', bindec($sumBinary));
 
    return $checksum;
}
```

A magyarázatba itt nem megyünk bele. Aki kíváncsi, némi google-zás segítségével talál többé-kevésbé értelmes magyarázatot arra, hogy mit és miért.

Ha megvan az ellenőrzőszám előállítása, nincs más hátra, mint összeállítani a kis ping csomagunkat:

```
function createICMPPacket($type, $code, $otherHeaders, $payload) {
    $type     = chr($type);
    $code     = chr($code);
    // Create a 0 checksum for checksum calculation
    $checksum = chr(0) . chr(0);
 
    $header   = $type . $code . $checksum . $otherHeaders;
    $checksum = calculateICMPChecksum($header, $payload);
    // Replace the checksum
    $header = $type . $code . $checksum . $otherHeaders;
 
    return $header . $payload;
}
```

Mint látható, az ellenőrzőszám számításához feltöltjük a helyét nullákkal, majd utána behelyettesítjük a helyes számot. Az ellenoldal ugyanezt fogja tenni fordított sorrendben: először kicseréli az ellenőrzőszámot nullákra, kiszámolja a számot, és összehasonlítja az eredeti értékkel.

Végezetül pedig megírjuk azt a függvényt, ami ténylegesen megnyitja az ICMP socketet. Sajnálatos módon ez \*NIX rendszereken csak rendszergazda üzemmódban fog menni. Mivel remélhetőleg épeszű ember ilyet nem ír PHP-ban, nem kell idetennem a figyelmeztetést, hogy ne futtass mindenféle programot rootként. Pláne ne PHP-t.

```
function ping($host) {
    $identifier = pack('n', mt_rand(0, 65535));
    $sequence   = chr(0) . chr(0);
    $packet     = createICMPPacket(8, 0, $identifier, $sequence, 'PingHost');
 
    // Open a raw ICMP socket
    $socket  = socket_create(AF_INET, SOCK_RAW, 1);
 
    // Set up a timeout
    socket_set_option($socket, SOL_SOCKET, SO_RCVTIMEO, array('sec' => 1, 'usec' => 0));
 
    // Open the socket towards the host
    socket_connect($socket, $host, null);
 
    // Start the clock
    $ts = microtime(true);
 
    // Send the ICMP packet
    socket_send($socket, $packet, strLen($packet), 0);
 
    // Read the response. We should parse it, but we're just going to assume it's ours.
    if ($response = socket_read($socket, 1500)) {
        // Stop the clock
        $result = microtime(true) - $ts;
    } else {
        $result = false;
    }
    return $result;
 
    // Close the socket
    socket_close($socket);
}
```

Mint látható, a visszatérő csomagot meg sem nézzük, csak konstatáljuk, hogy megérkezett, és ezzel mérünk időt. Házifeladatként érdemes implementálni a program azon felét is.

> **Tudtad?**  
> Egy ICMP echo request csomagnak nincs kötelező kiegészítő információja, ezért ez felhasználható arra, hogy ott tetszőleges adatot küldjünk. Így lehetséges például egy VPN kapcsolat létesítése kizárólag ICMP csomagokkal. Ezt a megoldást [ICMP tunnelnek](https://en.wikipedia.org/wiki/ICMP_tunnel) hívják.

## A User Datagram Protocol (UDP)

Eme rövid kitérő után nézzünk meg egy másik IP-re épülő protokollt, az UDP-t. Mint a neve is elárulja, ez a protokoll datagrammokat, azaz rövid adatüzeneteket küldözget. Ez sokban hasonlít az ICMP-re, de egy lényeges különbség mégis van:

Ha ICMP-t használunk párhuzamosan több programból, jellemzően mindkét program megkapja a másiknak szánt üzeneteket. Ez egy karbantartásra szánt protokollnál nem baj, de egy adatkicserélésnél már igen. Éppen ezért az UDP kapott egy plusz kiegészítőt: a portokat.

A portokat úgy kell elképzelni, mint egy telefonközponton a mellékeket. Nem elegendő megadni, hogy melyik telefonszámot hívjuk, tudnunk kell a melléket is. Ugyanígy van ez az UDP-nél is. Ahhoz, hogy tudjunk valahova adatot küldeni, az UDP-nél meg kell adnunk a forrás- és célportot is. Amíg a forrásport jellemzően véletlenszerűen kiválasztott, a célport általában jól ismert. Például a domain nevek feloldásáért felelős DNS (Domain Name System) szerver az 53-as porton figyel.

> **Tudtad?**  
> Egy eszközön maximum 65535 port lehetséges. Ha felhasználjuk az összes portot a programjainkból, akár kifele menő, akár befele jövő forgalommal, nem tudunk több portot nyitni. Az ezt megkisérlő program hibaüzenetet fog kapni.

## A Transmission Control Protocol (TCP)

Az eddigi protokolloknál a figyelmes olvasó egy közös vonást felfedezhetett: mindegyik csomag-alapú. Soha nem vittünk át a hálózat által támogatott maximális csomagméretnél több adatot, és az eddigi protokollokban nem is volt ilyesmire beépített támogatás.

Természetesen küldhetünk például több UDP csomagot, de honnan tudjuk, hogy melyik hova tartozik, vagy milyen sorrendben kell összerakni az adatfolyamot. (Emlékeztetőül: az Interneten semmi garancia nincs arra, hogy két, egymás után útnak indított csomag azonos sorrendben érkezik meg.)

A TCP az UDP-hez hasonlóan rendelkezik portokkal, ezzel lehetővé téve a több párhuzamos adatfolyamot, de orvosolja az UDP állapot nélküliségét is. Sok minden más mellett ugyanis bevezet egy úgynevezett *sequence numbert*, azaz megsorszámozza az egy kapcsolathoz tartozó csomagokat. A kapcsolat felépítésekor a két fél megállapodik a sorszámozás első eleméről, és ezután a kapcsolat lezártáig minden csomaggal növelik a sorszámot, ezzel biztosítva, hogy a csomagok a megfelelő sorrendben kerüljenek feldolgozásra.

### A kapcsolat felépítése

Nade, hogyan is zajlik egy ilyen kapcsolat felépítés?

![3way.001](assets/uploads/2016/03/29122721/3way.001.png)

A kapcsolatot kezdeményező fél küld egy TCP csomagot a fogadó félnek a *SYN* (synchronize) flaggel. Ezzel jelzi, hogy szeretne szinkronizálni, amire a másik fél visszaküld egy csomagot a *SYN* és *ACK* (acknowledgement, nyugtázás) flaggel. A kapcsolat felépítési folyamatot a kezdeményező cél részéről egy *ACK* csomag zárja. A SYN és SYN,ACK csomagok tartalmazzák a kezdeti sequence numbert, ebből tudja a másik fél, hogy honnan kell számolni.

### Adatfolyam

Miután megnyílt a kapcsolat, indulhat a kétirányú kommunikáció, az oda-vissza csomagok. Ahhoz, hogy ne tűnhessenek el csomagok, a TCP egy újabb mechanizmussal rendelkezik: időnként nyugtázza a megkapott adatokat egy *ACK* csomag küldésével. Ha az adatot küldő fél nem kapja meg bizonyos időközönként ezt a nyugtázást, megpróbálja újra küldeni a hiányzó csomagokat. Ezt a folyamatot hívják *retransmissionnek*.

> **Tudtad?**  
> A nagy webes cégek komoly kutatásokat folytatnak a TCP kapcsolat felépítésének, a retransmissionök hatékonyságának, és ezzel az adatátvitel sebességének növeléséért.

### A kapcsolat lezárása

A kapcsolat nyitásához hasonlóan a kapcsolat lezárása is rituálékkal teli folyamat a TCP esetén. Amelyik fél befejezte az adatok küldését, küld egy *FIN* csomagot, amit a másik egy *FIN* csomaggal nyugtáz. Ugyanakkor a másik fél ezen a félig zárt kapcsolaton keresztül továbbra is küldhet adatot, de fogadni már nem tud. Ha ő is végzett az adatok küldésével, a maga részéről is elküldi a *FIN* csomagot, amire szabályosan *ACK* a válasz.

Amennyiben nincs igény a félig nyitott kapcsolatra a folyamat meggyorsítható a *FIN - FIN,ACK - ACK* csomaghármas kicserélésével.

Ezzel viszont még nem zárult le a folyamat, a két gép a kapcsolat adatait továbbra is megtartja arra az esetre, ha egy régi csomag újraküldésre kerül. Ez a TIME\_WAIT állapot. (Ha ez nem lenne így, akkor egy új kapcsolat nyitása esetén az újraküldött csomag belekeveredhetne az új kapcsolatba.

> **Tudtad?**  
> Annak ellenére, hogy a TCP komoly erőfeszítéseket tesz a megbízhatóság érdekében, nincs garancia arra, hogy egy kapcsolat fennmarad, vagy a kapcsolat megszakadásáról értesülünk. Programozás közben fel kell arra készülni, hogy a másik oldal egyszerűen eltűnik, és ha nem próbálunk adatot küldeni, a kapcsolat csendben megszakad, miközben a programunk azt hiszi, hogy az még él. Éppen ezért a nagy megbízhatóságot igénylő rendszerekbe a TCP vagy UDP fölött érdemes egy folyamatos jelzés-kicserélést (heartbeat) és újracsatlakozási támogatást lehetővé tevő réteget építeni.

## A sorozat következő részében

Ezzel lezárult a modern Internetet alkotó három alap réteg tárgyalása. Természetesen ez csak egy bevezető. A különböző kiszolgáló, és segédprotokollok leírásával egész könyvespolcokat lehetne megtölteni.

A cikksorozat következő részében azzal foglalkozunk, hogy hogyan is működik a World Wide Web (WWW). Szó lesz a HTTP-ről, a DNS-ről és az azzal kapcsolatos fejleményekről, amik az elmúlt években történtek.

## Források

- [Internet Control Message Protocol](https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol)
- [The TCP/IP Guide](http://www.tcpipguide.com/)
- [The TIME-WAIT state in TCP and Its Effect on Busy Servers](http://www.isi.edu/touch/pubs/infocomm99/infocomm99-web/)