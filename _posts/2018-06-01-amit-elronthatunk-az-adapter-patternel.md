---
id: 1646
title: 'Amit elronthatunk az adapter patternel'
date: '2018-06-01T15:18:16+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/admin/?p=1646'
permalink: /2018/06/01/amit-elronthatunk-az-adapter-patternel/
tie_post_bg:
    - ''
tie_post_color:
    - ''
tie_gallery_style:
    - slider
tie_link_url:
    - ''
tie_link_desc:
    - ''
tie_video_url:
    - ''
tie_embed_code:
    - ''
tie_audio_mp3:
    - ''
tie_audio_m4a:
    - ''
tie_audio_oga:
    - ''
tie_audio_soundcloud:
    - ''
tie_quote_author:
    - ''
tie_quote_link:
    - ''
tie_quote_text:
    - ''
tie_status_facebook:
    - ''
tie_status_twitter:
    - ''
newsphere-meta-content-alignment:
    - align-content-left
amazonS3_cache:
    - 'a:4:{s:80:"//www.letscode.huassets/uploads/2018/06/adapter-blur-connection-1754492.jpg";a:2:{s:2:"id";i:1662;s:11:"source_type";s:13:"media-library";}s:89:"//www.letscode.huassets/uploads/2018/06/adapter-blur-connection-1754492-1024x683.jpg";a:2:{s:2:"id";i:1662;s:11:"source_type";s:13:"media-library";}s:110:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2018/06/09202501/adapter-blur-connection-1754492-scaled.jpg";a:2:{s:2:"id";i:1662;s:11:"source_type";s:13:"media-library";}s:112:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2018/06/09202501/adapter-blur-connection-1754492-1024x683.jpg";a:2:{s:2:"id";i:1662;s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2018/06/09202513/adapter-blur-connection-1754493-scaled.jpg'
categories:
    - Backend
    - PHP
---

[![](https://3.125.234.86assets/uploads/2018/06/adapter-blur-connection-1754492-1024x683.jpg)](https://3.125.234.86assets/uploads/2018/06/adapter-blur-connection-1754492-scaled.jpg)

Nemrégiben volt egy podcast epizódunk a függőségekről és arról, hogy melyiket is tudjuk leválasztani a domain logikánkról és mindezt hogyan. Ekkor említettük meg az adapter patternt, mint ideális megoldás, hiszen két különböző interfészt házasítunk össze vele. Egy e-mail küldési példát hoztunk fel akkor, így a mostani példámban is ezt fogom használni. A fő előny, amit az epizódban említettünk az az volt, hogy nem kell semmit tudnunk arról, hogy melyik implementációt használjuk később az e-mail kiküldésre és ezzel tudjuk a leghatékonyabban elválasztani a domain logikánkat a konkrét mail küldési implementációtól.

Rendben, de mégis hogyan?

**TL;DR:** Ne szennyezzük be az adaptereinket üzleti logikával. Semmi másra nem valók, mint két interfész között hidat képezzenek. Az SRP elvnél maradva, az egyetlen ok egy adapter változására, ha a két összekötött interfész egyike változik.

Az üzlet/domain szemszögéből fogunk elindulni, ahogy annak mindig is történnie kellene. A kijelentés az volt, hogy 'lehet csak az email címet tudjuk', tehát hozzunk létre egy egyszerű Mailer interfészt, aminek aztán később tudunk csinálni egy fake implementációt. Amikor később megtaláljuk a megfelelő megoldást az emailek kiküldésére, szimplán létrehozunk egy adaptert, hogy a mostani interfészt és a specifikus implementációt összeházasítsuk. Ennyire egyszerű. Ez az interfész lesz a határ vagy gateway az e-mail küldés felé az arcihtekturánk szemszögéből.

```
<pre class="graf graf--pre graf-after--p" id="8dae"><strong class="markup--strong markup--pre-strong">interface </strong>MailSender {
}
```

Rendben, megvan az interfészünk, mit tegyünk bele? Nyílván lesz egy send metódusunk:

```
<pre class="graf graf--pre graf-after--p" id="d9b6"><strong class="markup--strong markup--pre-strong">interface </strong>MailSender {

    <strong class="markup--strong markup--pre-strong">public function </strong>send($from, $to, $subject, $content);

}
```

Ha megvannak ezek a paraméterek, akkor a PHPMaileres implementációnk eléggé butácska lesz. Megkapja a paramétereket, kombinálja őket és átadja a PHPMailernek:

```
<pre class="graf graf--pre graf-after--p" id="a458"><strong class="markup--strong markup--pre-strong">class </strong>PhpMailSenderAdapter <strong class="markup--strong markup--pre-strong">implements </strong>MailSender {

    <em class="markup--em markup--pre-em">/**
     * </em><strong class="markup--strong markup--pre-strong"><em class="markup--em markup--pre-em">@var </em></strong><em class="markup--em markup--pre-em">PHPMailer
     */
    </em><strong class="markup--strong markup--pre-strong">private </strong>$phpMailer;

    <strong class="markup--strong markup--pre-strong">public function </strong>__construct(PHPMailer $phpMailer)
    {
        $this->phpMailer = $phpMailer;
    }

    <strong class="markup--strong markup--pre-strong">public function </strong>send($from, $to, $subject, $content)
    {
        $this->phpMailer->setFrom($from);
        $this->phpMailer->addAddress($to);
        $this->phpMailer->isHTML(<strong class="markup--strong markup--pre-strong">true</strong>);
        $this->phpMailer->Subject = $subject;
        $this->phpMailer->Body    = $content;
        $this->phpMailer->send();
    }
}
```

Viszont ahogy mondtam, mi ezt az üzleti igények oldaláról közelítjük meg és tegyük fel, hogy csak egyfajta e-mailt küldünk, tegyük fel heti hírleveleket. Akkor nem szükséges ilyen generikus megoldás, nemde? Ezen felül szeretnénk minél tovább eltekinteni minden olyan tényezőtől, ami a konkrét e-mail küldéssel kapcsolatos, ahogy Uncle Bob is ajánlja a könyveiben. Nézzük, hogy is néz ki, ha létrehozunk egy szolgáltatást a konkrét feladatra:

```
<pre class="graf graf--pre graf-after--p" id="1b9b"><strong class="markup--strong markup--pre-strong">interface </strong>MailSender {

    <strong class="markup--strong markup--pre-strong">public function </strong>sendNewsletter($to, $content);

}
```

Minimális tartalmat adunk át neki: a címet, ahova küldjük a hírleveleket és az e-mail tartalmát. Ennélfogva ezeket valahogy össze kell gyűjtenünk az adapterünkben, különben ilyen beégetett adatokkal fogjuk végezni:

```
<pre class="graf graf--pre graf-after--p" id="a7f9"><strong class="markup--strong markup--pre-strong">public function </strong>sendNewsletter($to, $content)
{
    $this->phpMailer->setFrom("noreply@letscode.hu");
    $this->phpMailer->addAddress($to);
    $this->phpMailer->isHTML(<strong class="markup--strong markup--pre-strong">true</strong>);
    $this->phpMailer->Subject = "Weekly newsletter";
    $this->phpMailer->Body    = $content;
    $this->phpMailer->send();
}
```

Rendben, tegyük fel, hogy össze tudtuk rántani a szükséges információkat ilyen-olyan szolgáltatásokon át, amik biztosítják a korábban beégetett adatokat és beinjektáltuk azokat DI segítségével:

```
<pre class="graf graf--pre graf-after--p" id="a54a"><strong class="markup--strong markup--pre-strong">public function </strong>sendNewsletter($to, $content)
{
    $this->phpMailer->setFrom($fromAddress);
    $this->phpMailer->addAddress($to);
    $this->phpMailer->isHTML(<strong class="markup--strong markup--pre-strong">true</strong>);
    $this->phpMailer->Subject = $newsletterSubject;
    $this->phpMailer->Body    = $content;
    $this->phpMailer->send();
}
```

Frankó, ugye? Seperc alatt leimplementálnánk valami hasonlót SwiftMailerben is, ugye?

### SOHA.NE.TEGYÜK.

(Természetesen nem azért, mert folyamatosan hozzáadunk új címeket egy PHPMailer példányhoz, de tekintsünk el ettől a ténytől, hiszen ez csak egy egyszerű példa.)

Na jó, mégis mi a gond a fenti nem-generikus megoldással? Hisz a nap végén elvégzi a dolgát, összeházasít két interfészt, nemde? Akkor mégis miért maradnánk a generikus megoldásnál és mozgatnánk oda a logikát a nem-generikusból?

Elég sok oka van, de a legfontosabb, hogy ez nyíltan sérti az SRP elvet, mivel már nem csak összeházasítunk két interfészt, hanem közben információt lapátolunk benne össze. Ha a PHPMailer (vagy amit épp használunk) interfésze változik, akkor bele kell nyúlnunk ebbe a kódba.

Tegyük fel, hogy be akarunk vezetni nyelvesítést, vagy bármi hasonló változik az üzleti igények szempontjából, azokat is itt kell megtennünk. Az adapter egy adapter, soha semmilyen körülmények között NEM szabad tartalmaznia semmi üzleti logikát. A kliensének kell szolgáltatnia minden szükséges információt. **Kivéve az infrastruktúrális elemeket, mint pl. az SMTP host és port, felhasználónév és jelszó, a fenti esetben.** Szintén megfeledkezdtünk az isHtml metódusról, ami szintén lehet üzletileg kritikus, mivel lehet plain text emaileket akarunk küldeni, mint pl. a Jenkins.

A fenti példában a konkrét e-mail kiküldés nem része a domainnek, hanem az infrastruktúrának a része. Ennélfogva az adapter feladata az lesz, hogy összekösse a domain rétegünk és az infrastruktúrális rétegünk határait. Ha ebben üzleti logikát helyezel el, akkor a logikánkat átfolyattuk egy másik rétegbe, ami nem jó, mivel szeretnénk az üzleti logikát az átláthatóság érdekében egy helyen tartani.

Nézzük meg mi történik, akkor ha Swiftmailer mellett döntünk? Ebben az esetben szintén be kell vezetnünk a fent említett logikát az "adapterben". Ha ez a logika változik, akkor módosítanunk kell mindkét osztályt, pedig sem a PHPMailer, sem a SwiftMailer interfésze sem változott. Természetesen létrehozhatunk egy újabb absztrakciós réteget és elburkolhatjuk az adapterünket benne, miközben a szükséges információt átadjuk neki. Ésszerűnek hangzik, ugye?

```
<pre class="graf graf--pre graf-after--p" id="65f0"><strong class="markup--strong markup--pre-strong">interface </strong>MailInterface {

    <strong class="markup--strong markup--pre-strong">public function </strong>send($from, $to, $subject, $content);

}
```

```
<pre class="graf graf--pre graf-after--pre" id="1157"><strong class="markup--strong markup--pre-strong">class </strong>NewsletterService {

    <em class="markup--em markup--pre-em">/**
     * </em><strong class="markup--strong markup--pre-strong"><em class="markup--em markup--pre-em">@var </em></strong><em class="markup--em markup--pre-em">MailInterface
     */
    </em><strong class="markup--strong markup--pre-strong">private </strong>$mailInterface;


    <strong class="markup--strong markup--pre-strong">public function </strong>sendNewsletter($to) {
        $this->mailInterface->send("noreply@letscode.hu", $to, "Weekly newsletter", "somecontent");
    }

}
```

A fenti példában egy generikus megoldásnál maradunk és elburkoljuk azt a **NewsletterService**-ben. A **NewsletterService** lesz felelős azért, hogy összegyűjtse a küldéshez szükséges információkat és a **MailInterface** pedig egy szimpla adapterként működik mappelve a metódusokat, akármilyen implementációt is használunk.

Win-win.

Update: Amikor egy sokkal generikusabb megoldást hoztunk létre a felhasználók értesítésére, mint pl. Twitter/e-mail/SMS, akkor a korábban említett megoldás felé egy újabb absztrakciós réteget kell bevezessünk. Az SMS-nek nem lesz témája, ahogy a tweeteknek sem, ellenben az e-maileknek igen.