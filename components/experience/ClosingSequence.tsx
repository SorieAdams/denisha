
"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import SunflowerSVG from "./SunflowerSVG"

export default function ClosingSequence() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
        className="divider-crimson w-16 mx-auto mb-20"
      />

      <div className="max-w-sm mx-auto space-y-8">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
          className="font-serif text-sm text-cream-dim leading-loose"
        >
          You have read all the messages, wishes, and prayers from your loved ones... 🤍
          And I think everything has been said...
          But just know,...You carry yourself with a quiet kind of strength that most people don’t even recognize
          as strength — because it isn’t loud. It doesn’t need to be. It shows up
          in the discipline you keep when no one is watching, in the faith you hold
          when things don’t make sense yet, in the way you simply keep going.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          className="font-serif text-sm text-cream-dim leading-loose"
        >
          But before you close this book, I just want to honor you. 🥲
          Firstly, academically...
          You are smart, determined, and brave.
          I mean... being a doctor through COMAHS is not child&apos;s play. 😂😂
          But hey... you are pulling it off. ❤️‍🔥
          You just made it past the Pre...
          Now we are on the Meds. 🩺😂
          One more time, I want to say CONGRATULATIONS! 🎉🎓
          I pray for breakthrough, more wisdom, knowledge, and understanding as you continue this journey. May God continue to guide you, strengthen you, and establish the work of your hands. 🙏🏽
          And then... your secret battles.
          Plus my troubles. 🥲
          I want to honor your strength.
          Sometimes I messed up at the wrong time...
          The time you were going through a lot...
          The time you needed someone to be there for you...
          The time I should have been there...
          That&apos;s the time I messed up. 💔
          I can&apos;t forget the time of your exam... when you were sick and having scraps...
          I wasn&apos;t there the way I was supposed to be.
          And honestly, I kept regretting everything.
          I tried to place it on...
          &quot;I was asking... I was calling... but you didn&apos;t say anything, and you were pushing me away...&quot;
          But the truth is...
          I was really pained because I failed to be there for you.
          And looking back, I know I could have done better. 🥲
          Through all our battles, misunderstandings, hiccups, and everything in between...
          I strongly believe God is building you.
          I mean... us.
          But especially you. 🥲🤍
          And I want to be someone you can trust.
          I want you to be confident in me.
          I want you to trust me without doubt...
          complete 💯 trust.
          Because sometimes I can be angry.
          Sometimes I can be in a bad mood.
          Sometimes I can be confused.
          Sometimes I can even be blind to the Truth.
          But I want you to always know this...
          I will never want to hurt you.
          I will never want to make you sad.
          I will never want to make you cry.
          Talk less of leaving you.
          I have my battles.
          I have my issues.
          But I just want you to be by my side...
          with complete trust. 🤍
          And today is your birthday...
          I don&apos;t want to bore you with all of this. 😂🥲
          They are the past.
          What matters now is what God is doing in you, what He is teaching us, and what He is still building ahead of us. 🙏🏽
          So my prayer for you is this:
          May the Strength of the Holy Spirit,
          the Grace of the Son of God,
          and the Blood of the Lamb of God
          rest upon you mightily. ❤️‍🔥🙏🏽
          May God continue to increase you in grace.
          May He give you more wisdom, knowledge, and understanding.
          May He bless your spiritual journey.
          May He bless your academic adventure.
          May He open doors for you.
          May He give you breakthrough after breakthrough. 🥹🙏🏽
          I wish you all the goodies and besties this world can give. 😂❤️
          More growth. More achievements. More grace. More memories. More reasons to smile. 🌻 And above everything... More of Christ. 🤍✝️

          Happy Awesome and Blissful Birthday, Denisha. 🎂🎉🌻
          Happy Birthday, Abba&apos;s Celeb. 👑🤍
          And thank you...
          For being part of this story. 📖🤍
          
           🌻
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
          className="font-serif text-sm text-cream-dim leading-loose"
        >
          The people in this experience didn’t just know your name.
          They knew you. And every single one of them wanted you to feel that today.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1.5 }}
          className="font-serif text-2xl text-cream pt-4"
        >
          Happy Birthday, Denisha.
        </motion.p>

        {/* Blessing line — echoes her faith, studies, and future love */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 1.5 }}
          className="font-sans text-xs tracking-[0.15em] text-crimson uppercase"
        >
          May this new chapter carry the same grace that brought you this far
          — in your faith, your calling, and the love still ahead of you.
        </motion.p>

        {/* Sunflower motif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 0.5, scale: 1 } : {}}
          transition={{ delay: 2.4, duration: 1.2 }}
          className="flex justify-center pt-4"
        >
          <SunflowerSVG size={44} color="#9b2335" />
        </motion.div>

        {/* Replay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2.8, duration: 1 }}
          className="pt-4"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-sans text-cream-dim hover:text-cream transition-colors border-b border-[#2e1a1a] hover:border-cream pb-0.5"
          >
            &hearts; Replay your memories
          </button>
        </motion.div>
      </div>
    </section>
  )
}
