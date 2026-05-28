export default function Home() {
  return (
    <>
      {/* =================== MASTHEAD =================== */}
      <header>
        <div className="flex min-h-[30px] flex-wrap items-center justify-between gap-5 bg-ink-dark px-6 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper max-bp:flex-nowrap max-bp:justify-center max-bp:gap-2.5 max-bp:px-4 max-bp:py-2.5 max-bp:text-[10px] max-bp:tracking-widest">
          <span>☞&nbsp;&nbsp;Cohort begins July 20</span>
          <span className="max-bp:hidden">
            <b className="text-ink-yellow">Applications open</b> · Early deadline Jun 10 · Final Jun 24
          </span>
          <span className="max-bp:hidden">$100K + SAFE · 12 weeks · Berkeley</span>
        </div>
      </header>

      {/* =================== HERO =================== */}
      <section className="relative overflow-visible pb-14 pt-16 max-bp:pb-10 max-bp:pt-9">
        <div className="wrap">
          <div className="hero-decor" aria-hidden="true">
            <div className="ring"></div>
            <div className="ht-fill"></div>
          </div>

          <div className="mb-[18px] flex flex-wrap items-center gap-3 max-bp:gap-2">
            <span className="bg-ink-dark px-3 py-[7px] font-mono text-[11px] uppercase tracking-[0.16em] text-paper whitespace-nowrap max-bp:whitespace-normal max-bp:text-[10.5px] max-bp:tracking-[0.12em]">
              A Software Incubator
            </span>
            <span className="bg-ink-pink px-3 py-[7px] font-mono text-[11px] uppercase tracking-[0.16em] text-paper whitespace-nowrap max-bp:whitespace-normal max-bp:text-[10.5px] max-bp:tracking-[0.12em]">
              For <b className="font-bold text-ink-dark">Massive Public Good</b>
            </span>
            <span className="font-display text-[22px] leading-none text-ink-blue">✻</span>
            <span className="bg-ink-dark px-3 py-[7px] font-mono text-[11px] uppercase tracking-[0.16em] text-paper whitespace-nowrap max-bp:whitespace-normal max-bp:text-[10.5px] max-bp:tracking-[0.12em]">
              In the Age of <b className="font-bold text-ink-yellow">Transformative AI</b>
            </span>
          </div>

          <h1 className="mega">
            SUR<span className="accent">PLUS</span>
          </h1>

          <div className="mega-tag">
            <span>☞&nbsp;&nbsp;An incubator for software startups</span>
            <span>3 months · starting late July</span>
            <span>Organized by Manifund &amp; Lightcone</span>
            <span></span>
            <span></span>
          </div>

          <div className="relative z-1 mt-11 grid grid-cols-[1.35fr_1fr] items-start gap-10 max-bp:mt-7 max-bp:grid-cols-1 max-bp:gap-7">
            <div>
              <p className="lede">
                &ldquo;<em>Surplus</em>&rdquo; is the value created through{" "}
                <mark>positive-sum trades</mark>; what markets produce in abundance.
                <span className="punch">Build it here.</span>
              </p>
            </div>

            <aside className="relative flex flex-col items-stretch gap-[22px]">
              <div className="border-[3px] border-ink-dark bg-paper">
                <div className="grid grid-cols-[110px_1fr] items-center gap-[14px] border-b-[1.5px] border-ink-dark p-[14px] last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">$100K</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-[0.04em]">
                      Investment, on a SAFE
                    </span>
                    <span className="font-mono text-[10.5px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      $2M post-money cap
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-[14px] border-b-[1.5px] border-ink-dark p-[14px] last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">12</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-[0.04em]">
                      Weeks of programming
                    </span>
                    <span className="font-mono text-[10.5px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      Jul 20 → Sep 18
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-[14px] border-b-[1.5px] border-ink-dark p-[14px] last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">2</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-[0.04em]">
                      Venues — Mox &amp; Lighthaven
                    </span>
                    <span className="font-mono text-[10.5px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      Berkeley
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-[14px] border-b-[1.5px] border-ink-dark p-[14px] last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">12&ndash;20</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-[0.04em]">
                      Founders in the cohort
                    </span>
                    <span className="font-mono text-[10.5px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      A small, dense room
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2 max-bp:justify-center">
                <a href="#apply" className="stamp" aria-label="Apply now">
                  <span className="ghost"></span>
                  <span className="disc">
                    <span className="inner">
                      <span className="word">APPLY</span>
                      <span className="sub">By June 24th</span>
                      <span className="arrows">☞ ☞ ☞</span>
                    </span>
                  </span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =================== MANIFESTO =================== */}
      <section className="relative border-b-[3px] border-t-8 border-ink-dark pb-7">
        <div className="mb-9 bg-ink-dark px-10 py-4 text-center font-condensed text-[clamp(18px,2.2vw,26px)] font-bold uppercase leading-[1.2] tracking-[0.06em] text-paper max-bp:px-[18px] max-bp:py-[14px] max-bp:text-[15px] max-bp:tracking-[0.04em]">
          —&nbsp;&nbsp;On the matter of <em className="not-italic text-ink-yellow">building good things</em>, plainly stated&nbsp;&nbsp;—
        </div>
        <div className="wrap">
          <div className="grid grid-cols-[180px_1fr_180px] gap-7 pt-4 max-bp:grid-cols-1 max-bp:gap-5">
            <div className="gloss">
              <span className="key">§&nbsp;Who</span>
              <span className="line">Founders who care about xrisk and flourishing futures.</span>
              <span className="key">§&nbsp;Where</span>
              <span className="line">Six weeks at Lighthaven, six weeks at Mox.</span>
              <span className="key">§&nbsp;What it costs</span>
              <span className="line">A SAFE. Not your soul.</span>
            </div>

            <div className="manifesto-body">
              <p>
                Surplus is an incubator for software startups, organized by <em>Manifund</em> and{" "}
                <em>Lightcone</em>. We are looking for founders building tools for{" "}
                <b>public good</b> in the age of transformative AI — people who would rather start
                something than join something, who have an idea they can&rsquo;t stop thinking
                about, who move fast and ship taste.
              </p>
              <p>
                We think now is an excellent time to start a for-profit. Vast torrents of
                philanthropic funding sit downstream of Anthropic employees and the OpenAI
                Foundation; 501c3s can buy services from, and invest in, for-profit corporations.
                There is a $100B market waiting to be constructed — <em>shovels waiting to be sold</em>.
              </p>
              <p>
                Building great software takes more than coding.{" "}
                <b>Product taste, visual design, distribution, sales and marketing</b> are all
                things that 2026 LLMs still fail at. We have developed these supplementary skills,
                and would love to foster them in a new generation of founders — while incubating
                projects that produce massive good for the world.
              </p>
            </div>

            <div className="gloss text-right max-bp:text-left">
              <span className="key">§&nbsp;Run by</span>
              <span className="line">Manifund &amp; Lightcone Infrastructure.</span>
              <span className="key">§&nbsp;Office hours</span>
              <span className="line">Weekly, with Austin Chen &amp; Oliver Habryka.</span>
              <span className="key">§&nbsp;Speakers</span>
              <span className="line">
                Andreas Stuhlmueller, Geoff Ralston, David Holz, Emmett Shear.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================== PROJECTS =================== */}
      <section className="pb-10 pt-7">
        <div className="wrap">
          <div className="section-h">
            <span className="num">01</span>
            <h2 className="ttl">Projects We&rsquo;re Excited For</h2>
            <span className="meta">
              Three categories
              <br />
              <b>— not exhaustive —</b>
            </span>
          </div>

          <div className="projects-intro grid grid-cols-[1.4fr_1fr] items-start gap-10 pb-12 pt-9 max-bp:grid-cols-1 max-bp:gap-4 max-bp:pb-7 max-bp:pt-6">
            <p className="copy">
              We&rsquo;re open to many proposals, but here are <b>three categories</b> of projects
              we&rsquo;re particularly well-suited to incubate. If your idea is adjacent —{" "}
              <em>apply anyway</em>.
            </p>
            <div className="pointer">☞ ☞ ☞</div>
          </div>

          <div className="grid grid-cols-3 border-l-[3px] border-t-[3px] border-ink-dark max-bp:grid-cols-1">
            <article className="cat">
              <span className="cat-bg" aria-hidden="true"></span>
              <div className="cat-head">
                <span className="cat-num">01</span>
                <h3 className="cat-title">AI for Epistemics &amp; Coordination</h3>
              </div>
              <p className="cat-blurb">
                LLM-powered tools that help people think better, work together, and build common
                knowledge.
              </p>
              <div className="examples-label">— Examples —</div>
              <ul>
                <li>
                  Fact-checking like{" "}
                  <a href="https://communitynotes.x.com/guide/en/about/introduction">
                    Community Notes
                  </a>{" "}
                  or <a href="https://www.pangram.com/">Pangram</a>
                </li>
                <li>
                  Knowledge bases like <a href="https://grokipedia.com/">Grokipedia</a> or{" "}
                  <a href="https://www.longtermwiki.com/">Longterm Wiki</a>
                </li>
                <li>
                  Research reports like <a href="https://elicit.com/">Elicit</a> or Deep Research
                </li>
                <li>
                  AI forecasting like <a href="https://www.mantic.com/">Mantic</a> or{" "}
                  <a href="https://futuresearch.ai/">Futuresearch</a>
                </li>
                <li>
                  AI simulation of human preferences, like <a href="https://simile.ai/">Simile</a>{" "}
                  or <a href="https://aaru.com/">Aaru</a>
                </li>
                <li>
                  AI for dispute resolution — community investigations; prediction-market criteria
                </li>
                <li>AI for democratic resilience, resisting authoritarianism</li>
              </ul>
            </article>

            <article className="cat">
              <span className="cat-bg" aria-hidden="true"></span>
              <div className="cat-head">
                <span className="cat-num">02</span>
                <h3 className="cat-title">Public-Facing Websites</h3>
              </div>
              <p className="cat-blurb">
                Many concepts in AI safety could be translated for a wider audience, with thoughtful
                design and an eye for virality.
              </p>
              <div className="examples-label">— Examples —</div>
              <ul>
                <li>
                  Microsites like <a href="https://ai-2027.com/">AI 2027</a>, showcasing concepts
                  through narrative &amp; interactive design
                </li>
                <li>
                  Visualizations like <a href="https://epoch.ai/">Epoch</a> and{" "}
                  <a href="https://ourworldindata.org/">Our World in Data</a>
                </li>
                <li>Transparency for what&rsquo;s happening inside labs, and across the AI supply chain</li>
                <li>
                  Courses like <a href="https://bluedot.org/">Bluedot</a>, helping people upskill
                  into relevant domains
                </li>
                <li>
                  Games like{" "}
                  <a href="https://www.decisionproblem.com/paperclips/">Universal Paperclips</a>,
                  teaching concepts (eg orthogonality) through play
                </li>
                <li>
                  Demos like <a href="https://aisafety.dance/">Nicky Case&rsquo;s</a>, or of topics
                  from recent alignment research papers
                </li>
              </ul>
            </article>

            <article className="cat">
              <span className="cat-bg" aria-hidden="true"></span>
              <div className="cat-head">
                <span className="cat-num">03</span>
                <h3 className="cat-title">Infra for the EA &amp; Safety Community</h3>
              </div>
              <p className="cat-blurb">
                Marketplaces or platforms, addressing common problems shared by people and orgs
                working to reduce xrisk.
              </p>
              <div className="examples-label">— Examples —</div>
              <ul>
                <li>
                  Job platforms like the <a href="https://jobs.80000hours.org/">80k Job Board</a>{" "}
                  or an &ldquo;AI safety LinkedIn&rdquo;
                </li>
                <li>Other work opportunities — fellowships, grassroots coordination</li>
                <li>
                  Funding platforms like <a href="https://manifund.org/">Manifund</a> or an
                  open-source{" "}
                  <a href="https://survivalandflourishing.fund/s-process">S-process</a>
                </li>
                <li>
                  Whitelabeled microgrant platforms like{" "}
                  <a href="https://www.astralcodexten.com/p/apply-for-an-acx-grant-2025">
                    ACX Grants
                  </a>{" "}
                  or <a href="https://bluedot.org/programs/rapid-grants">Bluedot Rapid Grants</a>
                </li>
                <li>AI-powered grantmaking and review</li>
                <li>
                  Writing platforms like <a href="https://www.lesswrong.com/">LessWrong</a>,{" "}
                  <a href="https://forum.effectivealtruism.org/">EA Forum</a>,{" "}
                  <a href="https://www.alignmentforum.org/">Alignment Forum</a>
                </li>
                <li>
                  Research platforms like <a href="https://distill.pub/">Distill</a> or{" "}
                  <a href="https://www.unjournal.org/">Unjournal</a>
                </li>
                <li>
                  Apps for events — conferences, workshops, retreats — aka &ldquo;better
                  Swapcard&rdquo;
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* =================== OFFERS =================== */}
      <section className="pb-14 pt-9">
        <div className="wrap">
          <div className="section-h">
            <span className="num">02</span>
            <h2 className="ttl">What We Offer</h2>
            <span className="meta">
              Capital · Community
              <br />
              Office hours · <b>Demo Day</b>
            </span>
          </div>

          <div className="grid grid-cols-6 gap-4 pt-8 max-bp:grid-cols-1">
            <div className="offer">
              <div className="o-num">No. 01 — Capital</div>
              <div className="o-body">
                <span className="o-big">$100K</span>
                <br />
                in investment, as a SAFE
              </div>
              <div className="o-note">at a $2M post-money cap.</div>
            </div>

            <div className="offer">
              <div className="o-num">No. 02 — Cohort</div>
              <div className="o-body">
                A cohort of founders who care about xrisk and <em>flourishing futures.</em>
              </div>
              <div className="o-note">Work alongside them — not above, not below.</div>
            </div>

            <div className="offer">
              <div className="o-num">No. 03 — Office Hours</div>
              <div className="o-body">
                Weekly office hours with{" "}
                <span className="text-ink-yellow">Austin Chen</span> &amp;{" "}
                <span className="text-ink-pink">Oliver Habryka</span>.
              </div>
              <div className="o-note">Bring real questions. Leave with real answers.</div>
            </div>

            <div className="offer">
              <div className="o-num">No. 04 — Place</div>
              <div className="o-body">Space to work at Mox &amp; Lighthaven.</div>
              <ul className="o-list">
                <li>Berkeley · Six weeks each</li>
                <li>Dinners, hallway run-ins, late nights</li>
              </ul>
            </div>

            <div className="offer">
              <div className="o-num">No. 05 — Demo Day</div>
              <div className="o-body">Demo Day with aligned VCs &amp; philanthropic funders.</div>
              <div className="o-note">September 18 — closing the cohort.</div>
            </div>

            <div className="offer bigrow">
              <div className="o-num">No. 06 — Speakers</div>
              <div className="spk">
                <b>—</b>&nbsp;Andreas Stuhlmueller · Geoff Ralston · David Holz · Emmett Shear ·{" "}
                <em>and more to announce.</em>
              </div>
              <div className="o-num text-right">Weekly · In person</div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== TIMELINE =================== */}
      <section className="pb-12 pt-8">
        <div className="wrap">
          <div className="section-h">
            <span className="num">03</span>
            <h2 className="ttl">Timeline</h2>
            <span className="meta">
              May → September <b>2025</b>
              <br />
              Twelve weeks of programming
            </span>
          </div>

          <div className="mt-8 border-t-[3px] border-ink-dark">
            <div className="tl major">
              <span className="date">May 29</span>
              <span className="dot"></span>
              <span className="label">Program Announced — Applications Open</span>
              <span className="note">
                <b>Submit via Airtable</b>
              </span>
            </div>

            <div className="tl sub">
              <em>Jun 5–7 · LessOnline at Lighthaven</em>
            </div>

            <div className="tl major">
              <span className="date">Jun 10</span>
              <span className="dot"></span>
              <span className="label">Early Applications Due</span>
              <span className="note">Reviewed on a rolling basis</span>
            </div>

            <div className="tl sub">
              <em>Jun 12–14 · Manifest at Lighthaven</em>
            </div>

            <div className="tl major">
              <span className="date">Jun 24</span>
              <span className="dot"></span>
              <span className="label">All Applications Due</span>
              <span className="note">
                <b>Final deadline</b>
              </span>
            </div>

            <div className="tl major">
              <span className="date">Jul 20</span>
              <span className="dot"></span>
              <div>
                <div className="label">Program Kickoff</div>
                <ul className="sublist">
                  <li>12 weeks of programming</li>
                  <li>Weekly speakers, workshops, office hours, dinners</li>
                  <li>Maybe: 2 weeks of iterating, cofounder matching up front</li>
                  <li>Maybe: 6 weeks at Lighthaven, 6 weeks at Mox</li>
                </ul>
              </div>
              <span className="note">Cohort begins</span>
            </div>

            <div className="tl major">
              <span className="date">Sep 18</span>
              <span className="dot"></span>
              <span className="label">Demo Day</span>
              <span className="note">
                <b>VCs &amp; Philanthropic Funders</b>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section className="pb-20 pt-8">
        <div className="wrap">
          <div className="section-h">
            <span className="num">04</span>
            <h2 className="ttl">Frequently Asked</h2>
            <span className="meta">
              Four questions
              <br />
              answered <b>plainly</b>
            </span>
          </div>

          <div className="mt-9 border-t-8 border-ink-dark">
            <article className="faq-item">
              <span className="q-num">Q1</span>
              <div>
                <h3 className="q">Why does Surplus encourage for-profit corps?</h3>
                <div className="a">
                  <p>
                    First, there are many standard reasons to use a for-profit corporation when
                    trying to do good. For-profits operate with <b>tight feedback loops</b>. They
                    can be more certain that they produce value (see: gains from trade,{" "}
                    <a href="https://paulgraham.com/wealth.html">Paul Graham on wealth</a>,
                    &ldquo;surplus&rdquo;). They can tap into a much larger pool of available
                    financing. They can compensate founders and early employees with financial
                    upside, should the venture work out well.
                  </p>
                  <p>
                    For-profit models are surprisingly flexible:{" "}
                    <a href="https://elicit.com/">Elicit</a>,{" "}
                    <a href="https://www.apolloresearch.ai/">Apollo</a>,{" "}
                    <a href="https://www.goodfire.ai/">Goodfire</a>,{" "}
                    <a href="https://www.wave.com/en/">Wave</a>,{" "}
                    <a href="https://www.dwarkesh.com/">Dwarkesh</a>,{" "}
                    <a href="https://lighthaven.space/">Lighthaven</a> and{" "}
                    <a href="https://manifest.is/">Manifest</a> all demonstrate different
                    approaches to making money while also serving the public interest.
                  </p>
                  <p>
                    Now is an excellent time to start a for-profit, given{" "}
                    <a href="https://nanransohoff.substack.com/p/the-third-wave-of-american-philanthropy">
                      vast torrents of funding
                    </a>{" "}
                    available from Anthropic employees and OpenAI Foundation. These funds are
                    distributed out of 501c3 entities — but 501c3s can pay for for-profit
                    services, and invest in for-profit corps. There&rsquo;s a $100B market waiting
                    to be constructed; <em>shovels waiting to be sold.</em>
                  </p>
                  <p>
                    And ideologically, we think that{" "}
                    <b>
                      equity is a beautiful mechanism for value alignment and credit allocation
                    </b>
                    . Manifund has previously experimented with{" "}
                    <a href="https://manifund.org/about/impact-certificates">
                      impact certificates
                    </a>{" "}
                    to bring this concept to the charity world; now, we think that plain ol&rsquo;
                    corporate equity will work fine, maybe with a light sprinkling of retroactive
                    funding or prize rounds or advance market commitments to finance public goods.
                  </p>
                </div>
              </div>
            </article>

            <article className="faq-item">
              <span className="q-num">Q2</span>
              <div>
                <h3 className="q">Why start a startup, rather than join a lab or an AI safety org?</h3>
                <div className="a">
                  <p>
                    It is absolutely the case that Anthropic or METR are great places to work. But
                    maybe:
                  </p>
                  <p>
                    —&nbsp;You&rsquo;re well suited towards starting projects: you enjoy{" "}
                    <em>independence</em>, have high risk tolerance, and moving fast.
                  </p>
                  <p>
                    —&nbsp;You&rsquo;re worried about the balance of power, as labs accumulate more
                    talent and funding.
                  </p>
                  <p>
                    —&nbsp;You have an idea that you <b>can&rsquo;t stop thinking about</b>, a pain
                    point you have to solve, something nobody else is doing that you think will
                    have a big impact.
                  </p>
                </div>
              </div>
            </article>

            <article className="faq-item">
              <span className="q-num">Q3</span>
              <div>
                <h3 className="q">Why should I join an incubator, when vibecoding is so easy?</h3>
                <div className="a">
                  <p>
                    Building great software takes <em>more than coding</em>.{" "}
                    <b>Product taste, visual design, distribution, sales and marketing</b> are all
                    things that 2026 LLMs still fail at. (Not to mention long-term coherence and
                    maintainability within a codebase.)
                  </p>
                  <p>
                    We&rsquo;ve developed these supplementary skills needed to ship successful
                    products, and would love to foster them in a new generation of founders.
                  </p>
                </div>
              </div>
            </article>

            <article className="faq-item">
              <span className="q-num">Q4</span>
              <div>
                <h3 className="q">What kind of outcomes is Surplus hoping for?</h3>
                <div className="a">
                  <p>
                    First and foremost, we&rsquo;re hoping to incubate projects that produce{" "}
                    <b>massive good for the world</b>.
                  </p>
                  <p>
                    Of course, we&rsquo;d be happy if our investments turn out profitable, helping
                    us invest in more great projects.
                  </p>
                  <p>
                    Finally, Manifund, Lightcone, and many others would be excited to hire
                    founder-shaped folks; even if your specific project doesn&rsquo;t succeed, your
                    time at Surplus will be a <em>fantastic work test.</em>
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =================== CTA =================== */}
      <section className="cta" id="apply">
        <div className="wrap z-1">
          <h2 className="cta-call">
            <span className="y">CODE</span> FOR MASSIVE
            <br />
            <span className="p">PUBLIC GOOD.</span>
          </h2>
          <div className="mt-[30px] grid grid-cols-[1fr_auto] items-end gap-10 border-t-[3px] border-paper pt-[30px] max-bp:grid-cols-1 max-bp:gap-6">
            <p className="max-w-[40ch] font-serif text-[22px] leading-[1.4] max-bp:text-[18px]">
              Build the thing you can&rsquo;t stop thinking about. We&rsquo;ll give you the capital,
              the cohort, the kitchen, and ninety days of company.
            </p>
            <a className="cta-btn" href="#apply">
              <span className="hand">☞</span>
              Apply by June 24
            </a>
          </div>
        </div>
      </section>

      {/* =================== COLOPHON =================== */}
      <footer className="bg-ink-dark pb-[50px] pt-[30px] font-mono text-[11px] uppercase tracking-[0.14em] text-paper">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-6 border-t-[1.5px] border-dotted border-[rgba(241,232,210,0.4)] pt-[22px] max-bp:flex-col max-bp:items-start max-bp:gap-2">
            <span className="font-display text-[18px] tracking-[0.06em] text-paper">SURPLUS — MMXXV</span>
            <span>
              Organized by <b className="text-ink-yellow">Manifund</b> &amp; <b className="text-ink-yellow">Lightcone</b>
            </span>
            <span>
              Printed in <span className="text-ink-pink">three&nbsp;inks</span> on Berkeley paper
            </span>
            <span>Demo Day · Sep&nbsp;18</span>
          </div>
        </div>
      </footer>
    </>
  );
}
