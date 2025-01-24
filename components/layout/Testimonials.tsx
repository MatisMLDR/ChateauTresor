import React from 'react'
import { TitleTwo } from "@/components/ui/TitleTwo";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie Lefreve",
      title: "Mère de famille",
      text: "Merci Château Trésor, participer à des chasses au trésor avec mes enfants n'a jamais été aussi simple. Une solution amusante et efficace !",
      image: "/user1.jpg",
    },
    {
      name: "Emile Johns",
      title: "Propriétaire de châteaux",
      text: "Grâce à Château Trésor, organiser des chasses au trésor pour mes visiteurs n'a jamais été aussi simple. C'est la solution parfaite !",
      image: "/user2.jpg",
    },
    {
      name: "Jean Dubois",
      title: "Entrepreneur en évènementiel",
      text: "Un gain de temps incroyable. J'ai adoré l'expérience utilisateur et je peux tout gérer facilement en quelques clics.",
      image: "/user3.jpg",
    },
  ];

  return (
    <section className="w-full py-10 md:py-20 bg-[#f7f7f7]" id="testimonials">
      <div className="container px-4 md:px-6">
        <TitleTwo text={"Ce que disent nos utilisateurs"} color={"dark"} />
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 bg-white p-6 shadow-md rounded-lg border border-[#d1d1d1]"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <blockquote className="text-center text-[#6c757d]">
                <p className="italic">{testimonial.text}</p>
              </blockquote>
              <div className="text-center">
                <p className="font-bold text-[#2b4e73]">{testimonial.name}</p>
                <p className="text-sm text-[#6c757d]">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
