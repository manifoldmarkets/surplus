export default function Home() {
  return (
    <>
      {/* =================== MASTHEAD =================== */}
      <header>
        <div className="flex flex-wrap items-center justify-between gap-5 bg-ink-dark px-6 py-1.5 font-mono text-xs uppercase tracking-widest text-paper max-bp:flex-nowrap max-bp:justify-center max-bp:gap-2.5 max-bp:px-4 max-bp:py-2.5">
          <span>☞&nbsp;&nbsp;Cohort begins July 20</span>
          <span className="max-bp:hidden">
            <b className="text-ink-yellow">Applications open</b> · Early deadline Jun 10 · Final Jun 24
          </span>
          <span className="max-bp:hidden">$100K + SAFE · 12 weeks · Berkeley</span>
        </div>
      </header>

      {/* =================== HERO =================== */}
      <section className="relative overflow-visible pb-14 pt-16 max-bp:pb-10 max-bp:pt-9">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div
            className="pointer-events-none absolute right-[-160px] top-[110px] z-0 h-80 w-80 opacity-85 max-bp:hidden"
            aria-hidden="true"
          >
            <div className="absolute inset-0 rounded-full border-[14px] border-ink-blue opacity-95 mix-blend-multiply"></div>
            <div className="halftone absolute inset-9 rounded-full opacity-65 mix-blend-multiply"></div>
          </div>

          <div className="mb-[18px] flex flex-wrap items-center gap-3 max-bp:gap-2">
            <span className="whitespace-nowrap bg-ink-dark px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-paper max-bp:whitespace-normal">
              A Software Incubator
            </span>
            <span className="whitespace-nowrap bg-ink-pink px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-paper max-bp:whitespace-normal">
              For <b className="font-bold text-ink-dark">Massive Public Good</b>
            </span>
            <span className="font-display text-xl leading-none text-ink-blue">✻</span>
            <span className="whitespace-nowrap bg-ink-dark px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-paper max-bp:whitespace-normal">
              In the Age of <b className="font-bold text-ink-yellow">Transformative AI</b>
            </span>
          </div>

          <h1 className="misreg relative m-0 font-display text-[clamp(76px,18vw,276px)] leading-[0.8] tracking-[-0.045em] text-ink-dark max-bp:whitespace-nowrap max-bp:text-[clamp(54px,17.5vw,124px)] max-bp:tracking-[-0.055em]">
            SUR<span className="misreg-accent text-ink-pink">PLUS</span>
          </h1>

          <div className="mt-1 flex items-baseline justify-between border-t-[3px] border-ink-dark pt-2.5 font-mono text-xs uppercase tracking-widest max-bp:flex-col max-bp:items-start max-bp:gap-1.5">
            <span>☞&nbsp;&nbsp;An incubator for software startups</span>
            <span>3 months · starting late July</span>
            <span>Organized by Manifund &amp; Lightcone</span>
            <span className="max-bp:hidden"></span>
            <span className="max-bp:hidden"></span>
          </div>

          <div className="relative z-[1] mt-11 grid grid-cols-[1.35fr_1fr] items-start gap-10 max-bp:mt-7 max-bp:grid-cols-1 max-bp:gap-7">
            <div>
              <p className="max-w-[18ch] font-serif text-3xl font-medium leading-[1.22] text-ink-dark [&_em]:italic [&_em]:text-ink-blue [&_mark]:bg-ink-yellow [&_mark]:px-1 [&_mark]:text-ink-dark max-bp:max-w-none max-bp:text-2xl">
                &ldquo;<em>Surplus</em>&rdquo; is the value created through{" "}
                <mark>positive-sum trades</mark>; what markets produce in abundance.
                <span className="misreg-blue mt-3.5 block font-display text-6xl leading-none text-ink-pink max-bp:text-4xl">
                  Build it here.
                </span>
              </p>
            </div>

            <aside className="relative flex flex-col items-stretch gap-5">
              <div className="border-[3px] border-ink-dark bg-paper">
                <div className="grid grid-cols-[110px_1fr] items-center gap-3.5 border-b-[1.5px] border-ink-dark p-3.5 last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">$100K</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
                      Investment, on a SAFE
                    </span>
                    <span className="font-mono text-[11px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      $2M post-money cap
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-3.5 border-b-[1.5px] border-ink-dark p-3.5 last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">12</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
                      Weeks of programming
                    </span>
                    <span className="font-mono text-[11px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      Jul 20 → Sep 18
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-3.5 border-b-[1.5px] border-ink-dark p-3.5 last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">2</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
                      Venues — Mox &amp; Lighthaven
                    </span>
                    <span className="font-mono text-[11px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      Berkeley
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-3.5 border-b-[1.5px] border-ink-dark p-3.5 last:border-b-0">
                  <span className="font-display text-[26px] leading-none text-ink-pink">12&ndash;20</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-condensed text-[13px] font-bold uppercase leading-[1.15] tracking-wide">
                      Founders in the cohort
                    </span>
                    <span className="font-mono text-[11px] uppercase leading-[1.15] tracking-widest text-ink-blue">
                      A small, dense room
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2 max-bp:justify-center">
                <a
                  href="#apply"
                  aria-label="Apply now"
                  className="relative inline-block h-[230px] w-[230px] -rotate-6 cursor-pointer no-underline transition-transform duration-200 ease-out hover:-rotate-3 hover:scale-105 active:rotate-[-2deg] active:scale-[0.99] max-bp:h-[190px] max-bp:w-[190px]"
                >
                  <span className="absolute inset-0 z-[-1] translate-x-2 translate-y-2 rounded-full bg-ink-blue opacity-90 mix-blend-multiply"></span>
                  <span className="absolute inset-0 grid place-items-center rounded-full bg-ink-pink text-center text-paper shadow-[inset_0_0_0_4px_var(--color-paper),inset_0_0_0_6px_var(--color-ink-pink)]">
                    <span className="flex flex-col items-center gap-1.5">
                      <span className="font-display text-5xl leading-none tracking-wide max-bp:text-4xl">APPLY</span>
                      <span className="font-mono text-xs uppercase tracking-widest">By June 24th</span>
                      <span className="mt-0.5 font-display text-xl tracking-wider">☞ ☞ ☞</span>
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
        <div className="mb-9 bg-ink-dark px-10 py-4 text-center font-condensed text-[clamp(18px,2.2vw,26px)] font-bold uppercase leading-tight tracking-wider text-paper max-bp:px-5 max-bp:py-3.5 max-bp:text-sm">
          —&nbsp;&nbsp;On the matter of <em className="not-italic text-ink-yellow">building good things</em>, plainly stated&nbsp;&nbsp;—
        </div>
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[180px_1fr_180px] gap-7 pt-4 max-bp:grid-cols-1 max-bp:gap-5">
            <div className="font-mono text-xs uppercase leading-normal tracking-widest">
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Who</span>
              <span className="mt-1 block opacity-85">Founders who care about xrisk and flourishing futures.</span>
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Where</span>
              <span className="mt-1 block opacity-85">Six weeks at Lighthaven, six weeks at Mox.</span>
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;What it costs</span>
              <span className="mt-1 block opacity-85">A SAFE. Not your soul.</span>
            </div>

            <div className="min-w-0 break-words text-base leading-relaxed [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[1.4em]">
              <p className="first-letter:float-left first-letter:pr-2.5 first-letter:pt-1.5 first-letter:font-display first-letter:text-[82px] first-letter:leading-[0.85] first-letter:text-ink-pink max-bp:first-letter:text-6xl">
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

            <div className="text-right font-mono text-xs uppercase leading-normal tracking-widest max-bp:text-left">
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Run by</span>
              <span className="mt-1 block opacity-85">Manifund &amp; Lightcone Infrastructure.</span>
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Office hours</span>
              <span className="mt-1 block opacity-85">Weekly, with Austin Chen &amp; Oliver Habryka.</span>
              <span className="mt-2.5 block text-sm font-bold tracking-widest text-ink-pink">§&nbsp;Speakers</span>
              <span className="mt-1 block opacity-85">
                Andreas Stuhlmueller, Geoff Ralston, David Holz, Emmett Shear.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================== PROJECTS =================== */}
      <section className="pb-10 pt-7">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[auto_1fr_auto] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] pt-18 max-bp:grid-cols-[auto_1fr] max-bp:gap-4 max-bp:pb-3.5 max-bp:pt-12">
            <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">01</span>
            <h2 className="font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">
              Projects We&rsquo;re Excited For
            </h2>
            <span className="pb-2.5 text-right font-mono text-xs uppercase tracking-widest max-bp:hidden [&_b]:text-ink-pink">
              Three categories
              <br />
              <b>— not exhaustive —</b>
            </span>
          </div>

          <div className="grid grid-cols-[1.4fr_1fr] items-start gap-10 pb-12 pt-9 max-bp:grid-cols-1 max-bp:gap-4 max-bp:pb-7 max-bp:pt-6">
            <p className="font-serif text-xl leading-snug [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue max-bp:text-lg">
              We&rsquo;re open to many proposals, but here are <b>three categories</b> of projects
              we&rsquo;re particularly well-suited to incubate. If your idea is adjacent —{" "}
              <em>apply anyway</em>.
            </p>
            <div className="self-end text-right font-display text-6xl leading-none text-ink-blue misreg-pink max-bp:self-start max-bp:text-left max-bp:text-4xl">
              ☞ ☞ ☞
            </div>
          </div>

          <div className="grid grid-cols-3 border-l-[3px] border-t-[3px] border-ink-dark max-bp:grid-cols-1">
            <article className="relative flex min-h-[540px] flex-col border-b-[3px] border-r-[3px] border-ink-dark bg-paper px-[26px] pb-[30px] pt-7 max-bp:min-h-0">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-3.5 h-[50px] w-[50px] rounded-full bg-ink-yellow opacity-70 mix-blend-multiply"
              ></span>
              <div className="relative z-[1] mb-[18px] flex items-start gap-4">
                <span className="font-display text-7xl leading-none text-ink-pink misreg-blue shrink-0">01</span>
                <h3 className="relative z-[1] mt-1.5 font-condensed text-xl font-bold uppercase leading-tight tracking-wide">
                  AI for Epistemics &amp; Coordination
                </h3>
              </div>
              <p className="mb-[18px] font-serif text-base italic leading-snug text-ink-dark">
                LLM-powered tools that help people think better, work together, and build common
                knowledge.
              </p>
              <div className="mb-3 border-y-[1.5px] border-ink-dark py-1.5 font-mono text-xs uppercase tracking-widest text-ink-blue">
                — Examples —
              </div>
              <ul className="font-serif text-sm leading-snug [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 [&_li:last-child]:border-b-0 [&_li]:relative [&_li]:border-b [&_li]:border-dotted [&_li]:border-ink-dark/40 [&_li]:py-[7px] [&_li]:pl-[22px] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[7px] [&_li]:before:text-sm [&_li]:before:text-ink-pink [&_li]:before:content-['✦']">
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

            <article className="relative flex min-h-[540px] flex-col border-b-[3px] border-r-[3px] border-ink-dark bg-paper px-[26px] pb-[30px] pt-7 max-bp:min-h-0">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-3.5 h-14 w-14 bg-[repeating-linear-gradient(45deg,var(--color-ink-blue)_0_3px,transparent_3px_8px)] opacity-55 mix-blend-multiply"
              ></span>
              <div className="relative z-[1] mb-[18px] flex items-start gap-4">
                <span className="font-display text-7xl leading-none text-ink-blue misreg-pink shrink-0">02</span>
                <h3 className="relative z-[1] mt-1.5 font-condensed text-xl font-bold uppercase leading-tight tracking-wide">
                  Public-Facing Websites
                </h3>
              </div>
              <p className="mb-[18px] font-serif text-base italic leading-snug text-ink-dark">
                Many concepts in AI safety could be translated for a wider audience, with thoughtful
                design and an eye for virality.
              </p>
              <div className="mb-3 border-y-[1.5px] border-ink-dark py-1.5 font-mono text-xs uppercase tracking-widest text-ink-blue">
                — Examples —
              </div>
              <ul className="font-serif text-sm leading-snug [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 [&_li:last-child]:border-b-0 [&_li]:relative [&_li]:border-b [&_li]:border-dotted [&_li]:border-ink-dark/40 [&_li]:py-[7px] [&_li]:pl-[22px] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[7px] [&_li]:before:text-sm [&_li]:before:text-ink-pink [&_li]:before:content-['✦']">
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

            <article className="relative flex min-h-[540px] flex-col border-b-[3px] border-r-[3px] border-ink-dark bg-paper px-[26px] pb-[30px] pt-7 max-bp:min-h-0">
              <span
                aria-hidden="true"
                className="halftone pointer-events-none absolute right-3.5 top-3.5 h-16 w-16 opacity-80 mix-blend-multiply [--dot-gap:9px] [--dot:2.2px]"
              ></span>
              <div className="relative z-[1] mb-[18px] flex items-start gap-4">
                <span className="font-display text-7xl leading-none text-ink-dark misreg-pink shrink-0">03</span>
                <h3 className="relative z-[1] mt-1.5 font-condensed text-xl font-bold uppercase leading-tight tracking-wide">
                  Infra for the EA &amp; Safety Community
                </h3>
              </div>
              <p className="mb-[18px] font-serif text-base italic leading-snug text-ink-dark">
                Marketplaces or platforms, addressing common problems shared by people and orgs
                working to reduce xrisk.
              </p>
              <div className="mb-3 border-y-[1.5px] border-ink-dark py-1.5 font-mono text-xs uppercase tracking-widest text-ink-blue">
                — Examples —
              </div>
              <ul className="font-serif text-sm leading-snug [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 [&_li:last-child]:border-b-0 [&_li]:relative [&_li]:border-b [&_li]:border-dotted [&_li]:border-ink-dark/40 [&_li]:py-[7px] [&_li]:pl-[22px] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[7px] [&_li]:before:text-sm [&_li]:before:text-ink-pink [&_li]:before:content-['✦']">
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
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[auto_1fr_auto] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] pt-18 max-bp:grid-cols-[auto_1fr] max-bp:gap-4 max-bp:pb-3.5 max-bp:pt-12">
            <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">02</span>
            <h2 className="font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">
              What We Offer
            </h2>
            <span className="pb-2.5 text-right font-mono text-xs uppercase tracking-widest max-bp:hidden [&_b]:text-ink-pink">
              Capital · Community
              <br />
              Office hours · <b>Demo Day</b>
            </span>
          </div>

          <div className="grid grid-cols-6 gap-4 pt-8 max-bp:grid-cols-1">
            <div className="relative col-span-2 flex min-h-[220px] flex-col justify-between border-[3px] border-ink-dark bg-ink-pink px-[18px] pb-5 pt-[22px] text-paper max-bp:col-span-1 max-bp:min-h-0">
              <div className="font-mono text-xs uppercase tracking-widest opacity-70">No. 01 — Capital</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                <span className="font-display text-6xl leading-none max-bp:text-5xl">$100K</span>
                <br />
                in investment, as a SAFE
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">at a $2M post-money cap.</div>
            </div>

            <div className="relative col-span-2 flex min-h-[220px] flex-col justify-between border-[3px] border-ink-dark bg-paper px-[18px] pb-5 pt-[22px] max-bp:col-span-1 max-bp:min-h-0">
              <div className="font-mono text-xs uppercase tracking-widest opacity-70">No. 02 — Cohort</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                A cohort of founders who care about xrisk and <em>flourishing futures.</em>
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">
                Work alongside them — not above, not below.
              </div>
            </div>

            <div className="relative col-span-2 flex min-h-[220px] flex-col justify-between border-[3px] border-ink-dark bg-ink-dark px-[18px] pb-5 pt-[22px] text-paper max-bp:col-span-1 max-bp:min-h-0">
              <div className="font-mono text-xs uppercase tracking-widest opacity-70">No. 03 — Office Hours</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                Weekly office hours with <span className="text-ink-yellow">Austin Chen</span> &amp;{" "}
                <span className="text-ink-pink">Oliver Habryka</span>.
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">
                Bring real questions. Leave with real answers.
              </div>
            </div>

            <div className="relative col-span-3 flex min-h-[220px] flex-col justify-between border-[3px] border-ink-dark bg-paper px-[18px] pb-5 pt-[22px] max-bp:col-span-1 max-bp:min-h-0">
              <div className="font-mono text-xs uppercase tracking-widest opacity-70">No. 04 — Place</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                Space to work at Mox &amp; Lighthaven.
              </div>
              <ul className="mt-2 font-serif text-base leading-snug [&_li:last-child]:border-b-0 [&_li]:border-b [&_li]:border-dotted [&_li]:border-current [&_li]:py-1">
                <li>Berkeley · Six weeks each</li>
                <li>Dinners, hallway run-ins, late nights</li>
              </ul>
            </div>

            <div className="relative col-span-3 flex min-h-[220px] flex-col justify-between border-[3px] border-ink-dark bg-ink-yellow px-[18px] pb-5 pt-[22px] max-bp:col-span-1 max-bp:min-h-0">
              <div className="font-mono text-xs uppercase tracking-widest opacity-70">No. 05 — Demo Day</div>
              <div className="mt-2.5 font-condensed text-3xl font-bold uppercase leading-none tracking-wide max-bp:text-xl">
                Demo Day with aligned VCs &amp; philanthropic funders.
              </div>
              <div className="mt-auto pt-3 font-serif text-sm italic leading-snug">
                September 18 — closing the cohort.
              </div>
            </div>

            <div className="relative col-span-6 grid min-h-[220px] grid-cols-[auto_1fr_auto] items-center gap-7 border-[3px] border-ink-dark bg-paper-deep px-[18px] pb-5 pt-[22px] max-bp:col-span-1 max-bp:min-h-0 max-bp:grid-cols-1 max-bp:gap-3">
              <div className="font-mono text-xs uppercase tracking-widest opacity-70">No. 06 — Speakers</div>
              <div className="font-condensed text-xl font-bold uppercase leading-tight [&_b]:text-ink-pink max-bp:text-lg">
                <b>—</b>&nbsp;Andreas Stuhlmueller · Geoff Ralston · David Holz · Emmett Shear ·{" "}
                <em>and more to announce.</em>
              </div>
              <div className="text-right font-mono text-xs uppercase tracking-widest opacity-70">Weekly · In person</div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== TIMELINE =================== */}
      <section className="pb-12 pt-8">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[auto_1fr_auto] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] pt-18 max-bp:grid-cols-[auto_1fr] max-bp:gap-4 max-bp:pb-3.5 max-bp:pt-12">
            <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">03</span>
            <h2 className="font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">Timeline</h2>
            <span className="pb-2.5 text-right font-mono text-xs uppercase tracking-widest max-bp:hidden [&_b]:text-ink-pink">
              May → September <b>2025</b>
              <br />
              Twelve weeks of programming
            </span>
          </div>

          <div className="mt-8 border-t-[3px] border-ink-dark">
            <div className="grid grid-cols-[160px_60px_1fr_240px] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">May 29</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <span className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                Program Announced — Applications Open
              </span>
              <span className="text-right font-mono text-xs uppercase tracking-widest text-ink-blue max-bp:hidden [&_b]:text-ink-pink">
                <b>Submit via Airtable</b>
              </span>
            </div>

            <div className="block border-b-[1.5px] border-ink-dark bg-ink-blue/5 py-2.5 pl-[200px] italic text-ink-blue max-bp:py-2 max-bp:pl-[88px] max-bp:text-sm">
              <em>Jun 5–7 · LessOnline at Lighthaven</em>
            </div>

            <div className="grid grid-cols-[160px_60px_1fr_240px] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">Jun 10</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <span className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                Early Applications Due
              </span>
              <span className="text-right font-mono text-xs uppercase tracking-widest text-ink-blue max-bp:hidden [&_b]:text-ink-pink">
                Reviewed on a rolling basis
              </span>
            </div>

            <div className="block border-b-[1.5px] border-ink-dark bg-ink-blue/5 py-2.5 pl-[200px] italic text-ink-blue max-bp:py-2 max-bp:pl-[88px] max-bp:text-sm">
              <em>Jun 12–14 · Manifest at Lighthaven</em>
            </div>

            <div className="grid grid-cols-[160px_60px_1fr_240px] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">Jun 24</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <span className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                All Applications Due
              </span>
              <span className="text-right font-mono text-xs uppercase tracking-widest text-ink-blue max-bp:hidden [&_b]:text-ink-pink">
                <b>Final deadline</b>
              </span>
            </div>

            <div className="grid grid-cols-[160px_60px_1fr_240px] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">Jul 20</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <div>
                <div className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Program Kickoff
                </div>
                <ul className="mt-1.5 list-none font-serif text-sm italic text-ink-dark [&_li]:py-0.5 [&_li]:before:text-ink-pink [&_li]:before:content-['—_']">
                  <li>12 weeks of programming</li>
                  <li>Weekly speakers, workshops, office hours, dinners</li>
                  <li>Maybe: 2 weeks of iterating, cofounder matching up front</li>
                  <li>Maybe: 6 weeks at Lighthaven, 6 weeks at Mox</li>
                </ul>
              </div>
              <span className="text-right font-mono text-xs uppercase tracking-widest text-ink-blue max-bp:hidden [&_b]:text-ink-pink">
                Cohort begins
              </span>
            </div>

            <div className="grid grid-cols-[160px_60px_1fr_240px] items-center gap-6 border-b-[3px] border-ink-dark py-[22px] max-bp:grid-cols-[88px_24px_1fr] max-bp:gap-3.5">
              <span className="font-display text-xl leading-none text-ink-pink max-bp:text-lg">Sep 18</span>
              <span className="h-7 w-7 justify-self-center rounded-full bg-ink-pink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5.5px_var(--color-ink-pink)]"></span>
              <span className="font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">Demo Day</span>
              <span className="text-right font-mono text-xs uppercase tracking-widest text-ink-blue max-bp:hidden [&_b]:text-ink-pink">
                <b>VCs &amp; Philanthropic Funders</b>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section className="pb-20 pt-8">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="grid grid-cols-[auto_1fr_auto] items-end gap-7 border-b-[3px] border-ink-dark pb-[18px] pt-18 max-bp:grid-cols-[auto_1fr] max-bp:gap-4 max-bp:pb-3.5 max-bp:pt-12">
            <span className="font-display text-8xl leading-none text-ink-pink misreg-blue max-bp:text-6xl">04</span>
            <h2 className="font-condensed text-6xl font-bold uppercase leading-none max-bp:text-3xl">
              Frequently Asked
            </h2>
            <span className="pb-2.5 text-right font-mono text-xs uppercase tracking-widest max-bp:hidden [&_b]:text-ink-pink">
              Four questions
              <br />
              answered <b>plainly</b>
            </span>
          </div>

          <div className="mt-9 border-t-8 border-ink-dark">
            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-pink misreg-blue max-bp:text-5xl">Q1</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Why does Surplus encourage for-profit corps?
                </h3>
                <div className="columns-2 gap-8 font-serif text-lg leading-relaxed [column-rule:1.5px_solid_rgba(20,21,43,0.3)] [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:columns-1 max-bp:text-base">
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

            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-pink misreg-blue max-bp:text-5xl">Q2</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Why start a startup, rather than join a lab or an AI safety org?
                </h3>
                <div className="columns-2 gap-8 font-serif text-lg leading-relaxed [column-rule:1.5px_solid_rgba(20,21,43,0.3)] [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:columns-1 max-bp:text-base">
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

            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-pink misreg-blue max-bp:text-5xl">Q3</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  Why should I join an incubator, when vibecoding is so easy?
                </h3>
                <div className="columns-2 gap-8 font-serif text-lg leading-relaxed [column-rule:1.5px_solid_rgba(20,21,43,0.3)] [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:columns-1 max-bp:text-base">
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

            <article className="grid grid-cols-[90px_1fr] gap-7 border-b-[3px] border-ink-dark pb-[30px] pt-7 max-bp:grid-cols-1 max-bp:gap-2.5 max-bp:pb-6 max-bp:pt-[22px]">
              <span className="font-display text-6xl leading-none text-ink-pink misreg-blue max-bp:text-5xl">Q4</span>
              <div>
                <h3 className="mb-4 font-condensed text-3xl font-bold uppercase leading-tight max-bp:text-xl">
                  What kind of outcomes is Surplus hoping for?
                </h3>
                <div className="columns-2 gap-8 font-serif text-lg leading-relaxed [column-rule:1.5px_solid_rgba(20,21,43,0.3)] [&_a:hover]:bg-ink-yellow [&_a:hover]:text-ink-dark [&_a:hover]:no-underline [&_a]:text-ink-blue [&_a]:underline [&_a]:underline-offset-2 [&_b]:bg-ink-yellow [&_b]:px-1 [&_b]:font-semibold [&_em]:italic [&_em]:text-ink-blue [&_p]:mb-[0.9em] max-bp:columns-1 max-bp:text-base">
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
      <section className="relative overflow-hidden bg-ink-dark pb-[60px] pt-20 text-paper max-bp:pb-12 max-bp:pt-14" id="apply">
        <span
          aria-hidden="true"
          className="halftone pointer-events-none absolute -right-[100px] -top-[100px] h-[500px] w-[500px] opacity-50 [--dot-gap:14px] [--dot:3px]"
        ></span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[150px] -left-[120px] h-[420px] w-[420px] rounded-full bg-ink-blue opacity-40 mix-blend-screen"
        ></span>
        <div className="relative z-[1] mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <h2 className="font-display text-[clamp(64px,8.5vw,128px)] leading-[0.82] tracking-[-0.04em]">
            <span className="text-ink-yellow">CODE</span> FOR MASSIVE
            <br />
            <span className="text-ink-pink">PUBLIC GOOD.</span>
          </h2>
          <div className="mt-[30px] grid grid-cols-[1fr_auto] items-end gap-10 border-t-[3px] border-paper pt-[30px] max-bp:grid-cols-1 max-bp:gap-6">
            <p className="max-w-[40ch] font-serif text-xl leading-snug max-bp:text-lg">
              Build the thing you can&rsquo;t stop thinking about. We&rsquo;ll give you the capital,
              the cohort, the kitchen, and ninety days of company.
            </p>
            <a
              className="inline-flex items-center gap-3.5 border-[3px] border-paper bg-ink-pink px-[30px] py-[22px] font-condensed text-3xl font-bold uppercase tracking-wide text-paper no-underline shadow-[8px_8px_0_var(--color-ink-blue)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[11px_11px_0_var(--color-ink-blue)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0_var(--color-ink-blue)] max-bp:px-[22px] max-bp:py-4 max-bp:text-xl"
              href="#apply"
            >
              <span className="font-display text-3xl">☞</span>
              Apply by June 24
            </a>
          </div>
        </div>
      </section>

      {/* =================== COLOPHON =================== */}
      <footer className="bg-ink-dark pb-7 pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper">
        <div className="relative mx-auto max-w-[1320px] px-14 max-bp:px-5">
          <div className="flex flex-wrap items-center justify-between gap-6 border-t-[1.5px] border-dotted border-paper/40 pt-4 max-bp:flex-col max-bp:items-start max-bp:gap-2">
            <span className="font-display text-lg tracking-[0.06em] text-paper">SURPLUS — MMXXV</span>
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
