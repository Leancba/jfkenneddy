const { Notices } = require("../db");
const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: "dsesxqny0",
  api_key: "767143763761942",
  api_secret: "vSyDqKE07mE2l8F8fHJH0_Qiy6A"
});

const getAllNotices = async (req, res) => {
  try {

    const allNotices = await Notices.findAll();
    

    res.status(200).json(allNotices);
  } catch (error) {
    console.log(error);
  }
};

const putNotice = async (req, res) => {
  
  const { id } = req.params;
  const { title, subtitle, description, image } = req.body;

  console.log('por lo menos entro', image)

  const response = await cloudinary.uploader.upload(`${image}`, {folder: "img_profile", public_id: `titulo-${title}`})

  try {

    const updatedNotice = await Notices.update(
        {
          title: title,
          subtitle:subtitle,
          description: description,
          image: response.url,
        },
        {
          where: { id: id },
          returning: true,
          plain: true 
        }
      );
      
      const notice = updatedNotice[1];
      
      res.status(200).json({ message: "La noticia se actualizó correctamente", notice: notice });
      

  } catch (error) {

    res.status(400).json({ error: "Error al modificar", message: error });

  }
};

const postNotice = async (req, res) => {
  const { title, subtitle, description, image } = req.body;

  try {
    const response = await cloudinary.uploader.upload(`${image}`, {
      folder: "img_profile",
      public_id: `titulo-${title}`,
    });

    const newReqBody = { ...req.body };
    newReqBody.image = response.url;

    const newNotice = await Notices.create(newReqBody);
    res.status(201).json(newNotice);
  } catch (error) {
    console.error(error);
    if (error.message.includes("request failed")) {
      res.status(500).json({ error: "Error uploading image to Cloudinary" });
    } else {
      res.status(400).json({ error: "Failed to create notice" });
    }
  }
};



const deleteNotice = async (req, res) => {

    const id = req.params.id;

  try {
    // buscar la noticia por id
    const notice = await Notices.findByPk(id);
    
    console.log(notice.title)

    

    if (!notice) {
      // si la noticia no existe, retorna un error 404
      return res.status(404).json({ error: 'La noticia no existe' });
    }
    // elimina la noticia
    await cloudinary.uploader.destroy(`img_profile/titulo-${notice.title}`);

    await notice.destroy();
    // retorna un mensaje de éxito
    res.json({ message: 'Noticia eliminada correctamente' });

  } catch (error) {
    
    res.status(400).json({ error: "Error al eliminar la noticia", message: error });
  }


};


module.exports = { getAllNotices, putNotice, postNotice, deleteNotice };
