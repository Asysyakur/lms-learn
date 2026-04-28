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
    title: "Ayo Bertanya",
    desc: "Tulis pertanyaan dan simpan jawabanmu.",
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
    title: "Latihan Soal",
    desc: "Kuis pilihan ganda atau essay.",
    step: 4,
    icon: ClipboardDocumentCheckIcon,
    accent: true,
  },
  {
    title: "Bandingkan dan Perbaiki",
    desc: "Tinjau jawaban eksplorasi dan edit jika perlu.",
    step: 5,
    icon: ArrowPathIcon,
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

  return sourceSteps.map((stepItem, index) => {
    const blueprint = stepBlueprintByType[stepItem.step_type] || meetingStepBlueprints[index] || {};

    return {
      ...blueprint,
      ...stepItem,
      step: stepItem.step || blueprint.step || index + 1,
      title: stepItem.title || blueprint.title,
      desc: stepItem.desc || blueprint.desc,
      icon: stepItem.icon || blueprint.icon,
      accent: typeof stepItem.accent === "boolean" ? stepItem.accent : blueprint.accent,
    };
  });
}
