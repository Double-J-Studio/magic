import { useEffect, useState } from "react";

import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/Tooltip";
import DeleteDialog from "@/components/DeleteDialog";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

import useSettingsStore, { Assistant } from "@/state/useSettingsStore";

interface FormData {
  name: string;
  instructions: string;
  assistants: Assistant[];
}

function generateUniqueId() {
  return "id-" + Math.random().toString(36).slice(2, 11) + "-" + Date.now();
}

const Assistants = () => {
  const [selectedId, setSelectedId] = useState(0);
  const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);
  const [isModifyButtonClicked, setIsModifyButtonClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { setAssistants } = useSettingsStore();

  const {
    register,
    control,
    reset,
    watch,
    setValue,
    setFocus,
    handleSubmit,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      instructions: "",
      assistants: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "assistants",
  });

  useEffect(() => {
    async function getAssistants() {
      const assistants = localStorage.getItem("assistants");
      if (assistants) {
        const results = await JSON.parse(assistants);

        reset({ assistants: results });
      }
    }

    getAssistants();
  }, [reset]);

  useEffect(() => {
    if (isCreateButtonClicked || isModifyButtonClicked) {
      setFocus("name");
    }
  }, [isCreateButtonClicked, isModifyButtonClicked, setFocus]);

  const handleCreateButtonClick = async () => {
    setIsCreateButtonClicked(true);
  };

  const handleModifyButtonClick = (field: Assistant, id: number) => {
    setSelectedId(id);
    setIsModifyButtonClicked(true);
    setValue("name", field.name);
    setValue("instructions", field.instructions);
  };

  const handleDeleteButtonClick = async (id: number) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const handleCancelButtonClick = () => {
    setIsCreateButtonClicked(false);
    setIsModifyButtonClicked(false);
    setValue("name", "");
    setValue("instructions", "");
    clearErrors();
  };

  const handleOpenChange = () => {
    setIsOpen((prev) => !prev);
  };

  const handleAssistantDelete = () => {
    remove(selectedId);
    localStorage.setItem("assistants", JSON.stringify(watch("assistants")));
    localStorage.removeItem("selectedAssistant");
    setAssistants(watch("assistants"));
    setIsOpen(false);
  };

  const handleFormSubmit = (data: FormData) => {
    if (isCreateButtonClicked) {
      const newId = generateUniqueId();
      append({
        id: newId,
        name: data.name,
        instructions: data.instructions,
      });
      setIsCreateButtonClicked(false);
    }

    if (isModifyButtonClicked) {
      update(selectedId, {
        ...fields[selectedId],
        name: data.name,
        instructions: data.instructions,
      });

      setIsModifyButtonClicked(false);
      setSelectedId(0);
    }

    localStorage.setItem("assistants", JSON.stringify(watch("assistants")));
    setAssistants(watch("assistants"));
    setValue("name", "");
    setValue("instructions", "");
  };

  return (
    <div className="flex items-center justify-center min-w-full py-10 overflow-auto">
      <Card className="w-full max-w-[80%] h-[80%] p-6 shadow-lg">
        <CardHeader className="relative flex flex-row items-center justify-between p-0">
          <CardTitle className="">Assistants</CardTitle>
          {!(isCreateButtonClicked || isModifyButtonClicked) && (
            <Button
              type="button"
              variant="outline"
              className="py-2 !m-0"
              name="create"
              onClick={() => handleCreateButtonClick()}
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create</span>
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-3 py-6 px-0">
          <div className="flex items-center justify-center gap-1">
            <div className="relative w-full">
              {isCreateButtonClicked || isModifyButtonClicked ? (
                <form
                  className="relative flex flex-col gap-2 w-full p-2 border border-solid border-gray-300 rounded-md"
                  onSubmit={handleSubmit(handleFormSubmit)}
                >
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      className={`w-full px-2 text-xs focus-visible:ring-transparent`}
                      placeholder="User friendly name"
                      {...register("name")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instructions">Instructions</Label>
                    <Controller
                      name="instructions"
                      control={control}
                      rules={{
                        required: "Instructions is required",
                        minLength: {
                          value: 2,
                          message:
                            "Instructions must be at least 2 characters.",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <AutosizeTextarea
                            {...field}
                            id="instructions"
                            className={`w-full px-2 text-xs focus-visible:ring-transparent`}
                            placeholder="You are a helpful assistant."
                          />

                          {error && (
                            <p className="px-2 py-1 text-xs text-red-500">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-1 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      name="cancel"
                      onClick={() => handleCancelButtonClick()}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="default"
                      name={isCreateButtonClicked ? "save" : "edit"}
                    >
                      {isCreateButtonClicked ? "Save" : "Edit"}
                    </Button>
                  </div>
                </form>
              ) : (
                <ul className="flex flex-col gap-2">
                  {fields.map((field, index) => {
                    return (
                      <li key={field.id} className="flex gap-1">
                        <div className="relative flex flex-col gap-1 w-full p-2 border border-solid border-gray-300 rounded-md group/item">
                          <div className="max-w-[calc(100%-20px)]">
                            <Label htmlFor="name" className="sr-only">
                              Name
                            </Label>
                            <div className="min-h-5 text-sm font-semibold">
                              {field.name || "Untitled Assistant"}
                            </div>
                          </div>

                          <div className="max-w-[calc(100%-20px)]">
                            <Label htmlFor="instructions" className="sr-only">
                              Instructions
                            </Label>
                            <div className="min-h-5 text-xs line-clamp-3">
                              {field.instructions}
                            </div>
                          </div>

                          <div className="absolute top-2 right-2 flex opacity-0 group-hover/item:opacity-100 transition-opacity duration-500">
                            <Tooltip side="top" description="Modify">
                              <Button
                                type="button"
                                variant="ghost"
                                className="w-5 h-5 p-0 group/button hover:bg-transparent"
                                name="modify"
                                onClick={() =>
                                  handleModifyButtonClick(field, index)
                                }
                              >
                                <span className="sr-only">Modify</span>
                                <PencilIcon className="w-3 h-3 group-hover/button:text-gray-600" />
                              </Button>
                            </Tooltip>

                            <Tooltip side="top" description="Delete">
                              <Button
                                type="button"
                                variant="ghost"
                                className="w-5 h-5 p-0 group/button hover:bg-transparent"
                                name="delete"
                                onClick={() => handleDeleteButtonClick(index)}
                              >
                                <span className="sr-only">Delete</span>
                                <TrashIcon className="w-3 h-3 group-hover/button:text-gray-600" />
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteDialog
        title="Delete Assistant"
        description="Please confirm that you want to remove this assistant. This action is irreversible."
        open={isOpen}
        onOpenChange={handleOpenChange}
        deleteFunction={handleAssistantDelete}
      />
    </div>
  );
};

export default Assistants;
