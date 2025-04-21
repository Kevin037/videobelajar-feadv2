import { useEffect, useState } from "react";
import Authlayout from "../Layouts/AuthLayout";
import { H1 } from "../Elements/heading";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useClass from "../../hooks/useClass";
import VideoPlayer from "../Fragments/Video";
import ProgressPopover from "../Fragments/Progress";
import useLesson from "../../hooks/useLesson";

const token = localStorage.getItem("token");
const MyClassPage = () => {
    const {id,lessonId} = useParams();
    const { selectedClass, classLessons } = useClass("",id);
    const lesson_id = lessonId ? lessonId : classLessons[0]?.lessons[0]?.id;
    const { selectedLesson,beforeLesson,afterLesson } = useLesson(lesson_id);

useEffect(() => {
    if(token === null) {
        window.location.href = "/login";
    }
}, []);

const [openIndex, setOpenIndex] = useState("");
const [activeLesson, setActiveLesson] = useState("");

useEffect(() => {
    if (selectedLesson) {
        setOpenIndex(selectedLesson?.group_name);
        setActiveLesson(lesson_id);
    }
}, [classLessons, selectedLesson]);

const toggle = (index) => {
  setOpenIndex(openIndex === index ? null : index);
};

const strLimit = (str, limit) => {
    if (!str) return "";
    return str.length > limit ? str.substring(0, limit) + "..." : str;
  };

 return (
    <Authlayout 
        title="Home" 
        navType="home" 
        withFooter={false} 
        mainLayout={true} 
        customLogo={beforeLesson && (
            <a href={`/class/${id}/${beforeLesson?.id}`}><span className="text-xl">←</span> {strLimit(beforeLesson?.name, 60)}</a>
        )}
        customHead={<ProgressPopover />}
        userPhoto={true}
    >
        <div className="border-t border-gray-200 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-12 ...">
                <div className="col-span-1 md:col-span-7 ... sm:pb-0 md:pb-20">
                    <VideoPlayer />
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-4">
                        <H1>Praktikkan Skill dengan Technical Book</H1>
                        <p>Pelajari dan praktikkan skill teknis dalam berbagai industri dengan Technical Book Riselearn</p>
                        <div className="my-2 grid grid-cols-3 grid-cols-12 ...">
                            <div className="col-span-1 ...">
                                <img src={`/assets/${selectedClass?.avatar}`} alt="" />
                            </div>
                            <div className="text-sm col-span-11 ...">
                                <p><b>{selectedClass?.user}</b></p>
                                <p>{selectedClass?.user_position} di {selectedClass?.user_company}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <img src="/assets/rating.svg"/>
                            <p>{selectedClass?.rating} ({selectedClass?.total_selling})</p>
                        </div>
                    </div>
                </div>
                <div className="cols-span-1 flex flex-col block md:hidden my-8">
                    <div className={`left-0 w-full bg-green-600 text-white flex ${afterLesson && !beforeLesson ? "justify-end" : "justify-between"} items-center px-4 py-3 z-50`}>
                        {beforeLesson && (
                            <button className="flex items-center gap-2 hover:opacity-70 cursor-pointer" onClick={() => {window.location.href = `/class/${id}/${beforeLesson?.id}`}}>
                                <span className="text-xl">←</span> Sebelumnya
                            </button>
                        )}
                        {afterLesson && (
                            <button className="flex items-right gap-2 hover:opacity-70 cursor-pointer" onClick={() => {window.location.href = `/class/${id}/${afterLesson?.id}`}}>
                                Selanjutnya <span className="text-xl">→</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="col-span-1 md:col-span-5 ... border-l border-gray-300">
                    <div className="md:overflow-y-scroll md:h-130 pb-4 mb-15">
                    {(openIndex !== "" && classLessons.length > 0 && activeLesson) && classLessons.map((section, index) => (
                        <div key={index} className="mb-4">
                        {/* Section Header */}
                        <button
                            onClick={() => toggle(section.title)}
                            className="w-full flex justify-between items-center font-semibold text-base focus:outline-none px-4 py-1"
                        >
                            <span className="hidden md:block">{section.title}</span>
                            <span className="block md:hidden">{strLimit(section.title, 35)}</span>
                            {openIndex === section.title ? (
                            <ChevronUp size={20} />
                            ) : (
                            <ChevronDown size={20} />
                            )}
                        </button>

                        {/* Lessons */}
                        {openIndex === section.title && section.lessons.length > 0 && (
                            <div className="mt-3 space-y-2">
                            {section.lessons.map((lesson, i) => (
                                <a key={i} href={`/class/${id}/${lesson.id}`} className="flex items-center">
                                <div
                                key={i}
                                className={`justify-between w-full ${activeLesson === lesson.id ? "bg-green-100" : "bg-white"} p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-green-50 mx-4`}
                                >
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <img src="../assets/play.svg" alt="" />
                                            <span className="text-sm text-gray-800">Video: </span>
                                            {lesson.name}
                                        </div>
                                        <span className="text-sm text-gray-500 ml-6">{lesson.duration} menit</span>
                                    </div>
                                </div>
                                </a>
                            ))}
                            </div>
                        )}
                        </div>
                    ))}
                    </div>
                    <div className="fixed bottom-0 md:bottom-13 w-full bg-orange-400 p-4 mt-4 hover:opacity-80">
                        <Link to={`/class/${id}/facilities`} className="text-white flex gap-2"><img src="../assets/star.svg" alt="" /> Beri Review & Rating</Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-col hidden md:block">
                {/* Footer navigasi tetap di bawah */}
                <div className={`fixed bottom-0 left-0 w-full bg-green-600 text-white flex ${afterLesson && !beforeLesson ? "justify-end" : "justify-between"} items-center px-4 py-3 z-50`}>
                    {beforeLesson && (
                        <button className="flex items-center gap-2 hover:opacity-70 cursor-pointer" onClick={() => {window.location.href = `/class/${id}/${beforeLesson?.id}`}}>
                            <span className="text-xl">←</span> {strLimit(beforeLesson?.name, 60)}
                        </button>
                    )}
                    {afterLesson && (
                        <button className="flex items-right gap-2 hover:opacity-70 cursor-pointer" onClick={() => {window.location.href = `/class/${id}/${afterLesson?.id}`}}>
                            {strLimit(afterLesson?.name, 60)} <span className="text-xl">→</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    </Authlayout>
 );
}

export default MyClassPage