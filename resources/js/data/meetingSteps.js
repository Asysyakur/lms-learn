import {
  ArrowPathIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

export const meetingStepBlueprints = [
  {
    title: "Mari Mengamati",
    desc: "Lihat PPT atau video yang sudah disiapkan.",
    step: 1,
    icon: MagnifyingGlassIcon,
    accent: false,
  },
  {
    title: "Ayo Jawab",
    desc: "Tulis jawabanmu.",
    step: 2,
    icon: ChatBubbleLeftRightIcon,
    accent: true,
  },
  {
    title: "Eksplorasi",
    desc: "Isi sesuai instruksi khusus tiap pertemuan.",
    step: 3,
    icon: BeakerIcon,
    accent: false,
  },
  {
    title: "Pembuktian",
    desc: "Buktikan pemahamanmu dengan latihan soal atau tugas praktis.",
    step: 4,
    icon: ArrowPathIcon,
    accent: true,
  },
  {
    title: "Latihan Soal",
    desc: "Kuis pilihan ganda atau essay.",
    step: 5,
    icon: ClipboardDocumentCheckIcon,
    accent: false,
  },
  {
    title: "Refleksi",
    desc: "Jawab pertanyaan penutup di textbox.",
    step: 6,
    icon: QuestionMarkCircleIcon,
    accent: true,
  },
];

const stepBlueprintByType = {
  observe: meetingStepBlueprints[0],
  ask: meetingStepBlueprints[1],
  exploration: meetingStepBlueprints[2],
  practice: meetingStepBlueprints[3],
  review: meetingStepBlueprints[4],
  reflection: meetingStepBlueprints[5],
};

export function decorateMeetingSteps(steps = []) {
  const sourceSteps = steps.length > 0 ? steps : meetingStepBlueprints;
  const orderedSteps = [...sourceSteps].sort((left, right) => {
    const leftStep = Number(left.step ?? left.step_number ?? 0);
    const rightStep = Number(right.step ?? right.step_number ?? 0);

    return leftStep - rightStep;
  });

  return orderedSteps.map((stepItem, index) => {
    const blueprint = stepBlueprintByType[stepItem.step_type] || meetingStepBlueprints[index] || {};
    const stepNumber = Number(stepItem.step ?? stepItem.step_number ?? blueprint.step ?? index + 1);

    return {
      ...blueprint,
      ...stepItem,
      step: stepNumber,
      title: stepItem.title || blueprint.title,
      desc: stepItem.desc || blueprint.desc,
      icon: stepItem.icon || blueprint.icon,
      accent: stepNumber % 2 === 0,
    };
  });
}
